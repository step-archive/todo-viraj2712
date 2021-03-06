const qs = require('querystring');

const parseBody = text => qs.parse(text) || {};

let redirect = function(path) {
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location', path);
  this.end();
};

const parseCookies = text => {
  try {
    return qs.parse(text) || {};
  } catch (e) {
    return {};
  }
}

let invoke = function(req, res) {
  let handler = this._handlers[req.method][req.url];
  if (handler) handler(req, res);
  return;
}

const initialize = function() {
  this._handlers = {
    GET: {},
    POST: {}
  };
  this._preprocess = [];
  this._postprocessor = [];
};

const get = function(url, handler) {
  this._handlers.GET[url] = handler;
}

const post = function(url, handler) {
  this._handlers.POST[url] = handler;
};

const use = function(handler) {
  this._preprocess.push(handler);
};

const addPostProcessor = function(handler) {
  this._postprocessor.push(handler);
};

let urlIsOneOf = function(urls) {
  return urls.includes(this.url);
}

const main = function(req, res) {
  res.redirect = redirect.bind(res);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  req.cookies = parseCookies(req.headers.cookie || '');
  let content = "";
  req.on('data', data => content += data.toString());
  req.on('end', () => {
    req.body = parseBody(content);
    content = "";
    this._preprocess.forEach(middleware => {
      if (res.finished) return;
      middleware(req, res);
    });
    if (res.finished) return;
    invoke.call(this, req, res);
    if (!res.finished) {
      this._postprocessor.forEach(fn => {
        if (res.finished) return;
        fn(req, res)
      });
    }
  });
};

let create = () => {
  let rh = (req, res) => {
    main.call(rh, req, res)
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  rh.addPostProcessor = addPostProcessor;
  return rh;
}
exports.create = create;
