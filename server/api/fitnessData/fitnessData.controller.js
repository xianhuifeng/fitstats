'use strict';

var FitnessData = require('./fitnessData.model');
var User = require('../user/user.model');

exports.requestFitnessStat = function(req, res) {

  var dataRequested = req.params['0']; //get request params['0'], sample of request params: { '0': 'bf', id: '53c6cc775ca01d42f3373d46', date: '20140716' }
  var today         = req.params['date']; //get request params['date']

  User.findById(req.params['id'], function(err, user){
    if (err) return next(err);
    //console.log('find a user in requestFitnessStat', user, dataRequested, user.fitnessData.length)
    if( user.fitnessData.length === 0){
      console.log('New user, empty fitnessData');
      res.send(200);
    } else {
      user.fitnessData.forEach(function(value, index, array){//date is value of each item in array
        //console.log(value['date'] , today)
        if(value['date'] === today){
          res.json({data: value[dataRequested], field: dataRequested}); //response data
        } else {
          console.log('New date, need enter data.');
          res.send(200);
        }
      });   
    }
  });
};



exports.updateFitnessStat = function(req, res) {
/*req.body { userId: '53c79bec3d293d0000859c72',
  date: '20140717',
  field: 'weight',
  data: '120.0' }*/
  var data        = req.body;
  var updateDate  = String(data.date);
  var updateField = data.field;
  var newStat     = data.data;
  var userId      = data.userId;

  User.findById(userId, function(err, user){
    if(user.fitnessData.length === 0){
      var newDateFitnessData = new FitnessData({date: updateDate, updateField: newStat});
      user.fitnessData.push(newDateFitnessData.toObject());
      user.save(function(err){
        if(err) return res.send(401);
        res.send(200);
      });
    } else {
      user.fitnessData.forEach(function(value, index, array){
        if(value['date'] === updateDate ){
          value[updateField] = newStat;
          user.save(function(err){
            if(err) return res.send(401);
            res.send(200);
          });
        } else {
          console.log("This is a new date to be updated", updateDate);
          var newDateFitnessData = new FitnessData({date: updateDate, updateField: newStat});
          user.fitnessData.push(newDateFitnessData.toObject());
          user.save(function(err){
            if(err) return res.send(401);
            res.send(200);
          });
        }
      });
    }
  }); 

  return res.json({data: data});
};



  // console.log('GET req: ', req.params);
  // req.params=>   { '0': 'weight',
  //   id: '53c6c52f9fc87084680be124',
  //   date: '20140716'
  // }


  // console.log('PUT req: ', req.body)
  // req.body => {
  //   userId: '53c6c52f9fc87084680be124',
  //   date: '20140716',
  //   field: 'weight',
  //   data: '100.0'
  // }


/*    REQ:

// req.params('userId')
// req.params('date')

{ _readableState:
   { highWaterMark: 16384,
     buffer: [],
     length: 0,
     pipes: null,
     pipesCount: 0,
     flowing: false,
     ended: true,
     endEmitted: true,
     reading: false,
     calledRead: true,
     sync: false,
     needReadable: true,
     emittedReadable: false,
     readableListening: false,
     objectMode: false,
     defaultEncoding: 'utf8',
     ranOut: false,
     awaitDrain: 0,
     readingMore: false,
     decoder: null,
     encoding: null },
  readable: false,
  domain: null,
  _events: { close: [ [Function] ], readable: [Function] },
  _maxListeners: 10,
  socket:
   { _connecting: false,
     _handle:
      { fd: 73,
        writeQueueSize: 0,
        owner: [Circular],
        onread: [Function: onread],
        reading: true },
     _readableState:
      { highWaterMark: 16384,
        buffer: [],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: false,
        ended: false,
        endEmitted: false,
        reading: true,
        calledRead: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        objectMode: false,
        defaultEncoding: 'utf8',
        ranOut: false,
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: true,
     domain: null,
     _events:
      { end: [Object],
        finish: [Function: onSocketFinish],
        _socketEnd: [Function: onSocketEnd],
        drain: [Object],
        timeout: [Function],
        error: [Function],
        close: [Object] },
     _maxListeners: 10,
     _writableState:
      { highWaterMark: 16384,
        objectMode: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        decodeStrings: false,
        defaultEncoding: 'utf8',
        length: 0,
        writing: false,
        sync: false,
        bufferProcessing: false,
        onwrite: [Function],
        writecb: null,
        writelen: 0,
        buffer: [],
        errorEmitted: false },
     writable: true,
     allowHalfOpen: true,
     onend: [Function],
     destroyed: false,
     bytesRead: 9332,
     _bytesDispatched: 400197,
     _pendingData: null,
     _pendingEncoding: '',
     server:
      { domain: null,
        _events: [Object],
        _maxListeners: 10,
        _connections: 6,
        connections: [Getter/Setter],
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        allowHalfOpen: true,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _connectionKey: '4:0.0.0.0:9000' },
     _idleTimeout: 120000,
     _idleNext:
      { _connecting: false,
        _handle: [Object],
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: 10,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: true,
        onend: [Function],
        destroyed: false,
        bytesRead: 4015,
        _bytesDispatched: 83343,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _idleTimeout: 120000,
        _idleNext: [Object],
        _idlePrev: [Circular],
        _idleStart: 1405474471369,
        parser: [Object],
        ondata: [Function],
        _paused: false,
        _httpMessage: null },
     _idlePrev: { _idleNext: [Circular], _idlePrev: [Object] },
     _idleStart: 1405474483860,
     parser:
      { _headers: [],
        _url: '',
        onHeaders: [Function: parserOnHeaders],
        onHeadersComplete: [Function: parserOnHeadersComplete],
        onBody: [Function: parserOnBody],
        onMessageComplete: [Function: parserOnMessageComplete],
        socket: [Circular],
        incoming: [Circular],
        maxHeaderPairs: 2000,
        onIncoming: [Function] },
     ondata: [Function],
     _paused: false,
     _httpMessage:
      { domain: null,
        _events: [Object],
        _maxListeners: 10,
        output: [],
        outputEncodings: [],
        writable: true,
        _last: false,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _headerSent: false,
        _header: '',
        _hasBody: true,
        _trailer: '',
        finished: false,
        _hangupClose: false,
        socket: [Circular],
        connection: [Circular],
        _headers: [Object],
        _headerNames: [Object],
        req: [Circular],
        locals: {},
        flush: [Function: noop],
        write: [Function],
        end: [Function],
        on: [Function],
        writeHead: [Function],
        _livereload: true },
     _peername: { address: '127.0.0.1', family: 'IPv4', port: 56804 } },
  connection:
   { _connecting: false,
     _handle:
      { fd: 73,
        writeQueueSize: 0,
        owner: [Circular],
        onread: [Function: onread],
        reading: true },
     _readableState:
      { highWaterMark: 16384,
        buffer: [],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: false,
        ended: false,
        endEmitted: false,
        reading: true,
        calledRead: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        objectMode: false,
        defaultEncoding: 'utf8',
        ranOut: false,
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: true,
     domain: null,
     _events:
      { end: [Object],
        finish: [Function: onSocketFinish],
        _socketEnd: [Function: onSocketEnd],
        drain: [Object],
        timeout: [Function],
        error: [Function],
        close: [Object] },
     _maxListeners: 10,
     _writableState:
      { highWaterMark: 16384,
        objectMode: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        decodeStrings: false,
        defaultEncoding: 'utf8',
        length: 0,
        writing: false,
        sync: false,
        bufferProcessing: false,
        onwrite: [Function],
        writecb: null,
        writelen: 0,
        buffer: [],
        errorEmitted: false },
     writable: true,
     allowHalfOpen: true,
     onend: [Function],
     destroyed: false,
     bytesRead: 9332,
     _bytesDispatched: 400197,
     _pendingData: null,
     _pendingEncoding: '',
     server:
      { domain: null,
        _events: [Object],
        _maxListeners: 10,
        _connections: 6,
        connections: [Getter/Setter],
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        allowHalfOpen: true,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _connectionKey: '4:0.0.0.0:9000' },
     _idleTimeout: 120000,
     _idleNext:
      { _connecting: false,
        _handle: [Object],
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: 10,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: true,
        onend: [Function],
        destroyed: false,
        bytesRead: 4015,
        _bytesDispatched: 83343,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _idleTimeout: 120000,
        _idleNext: [Object],
        _idlePrev: [Circular],
        _idleStart: 1405474471369,
        parser: [Object],
        ondata: [Function],
        _paused: false,
        _httpMessage: null },
     _idlePrev: { _idleNext: [Circular], _idlePrev: [Object] },
     _idleStart: 1405474483860,
     parser:
      { _headers: [],
        _url: '',
        onHeaders: [Function: parserOnHeaders],
        onHeadersComplete: [Function: parserOnHeadersComplete],
        onBody: [Function: parserOnBody],
        onMessageComplete: [Function: parserOnMessageComplete],
        socket: [Circular],
        incoming: [Circular],
        maxHeaderPairs: 2000,
        onIncoming: [Function] },
     ondata: [Function],
     _paused: false,
     _httpMessage:
      { domain: null,
        _events: [Object],
        _maxListeners: 10,
        output: [],
        outputEncodings: [],
        writable: true,
        _last: false,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _headerSent: false,
        _header: '',
        _hasBody: true,
        _trailer: '',
        finished: false,
        _hangupClose: false,
        socket: [Circular],
        connection: [Circular],
        _headers: [Object],
        _headerNames: [Object],
        req: [Circular],
        locals: {},
        flush: [Function: noop],
        write: [Function],
        end: [Function],
        on: [Function],
        writeHead: [Function],
        _livereload: true },
     _peername: { address: '127.0.0.1', family: 'IPv4', port: 56804 } },
  httpVersion: '1.1',
  complete: true,
  headers:
   { host: 'localhost:9000',
     connection: 'keep-alive',
     'content-length': '16',
     'cache-control': 'no-cache',
     pragma: 'no-cache',
     accept: 'application/json, text/plain,',
     origin: 'http://localhost:9000',
     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
     'content-type': 'application/json;charset=UTF-8',
     referer: 'http://localhost:9000/login',
     'accept-encoding': 'gzip,deflate,sdch',
     'accept-language': 'en-US,en;q=0.8,fr;q=0.6',
     cookie: 'connect.sid=s%3Ad2ueS6nlFWy6jIcxPvla313j.uX8GogxjqUy5Bxd0EYiLj0nHS3syr%2BhaMGVt6H1ucS8' },
  trailers: {},
  _pendings: [],
  _pendingIndex: 0,
  url: '/weight',
  method: 'PUT',
  statusCode: null,
  client:
   { _connecting: false,
     _handle:
      { fd: 73,
        writeQueueSize: 0,
        owner: [Circular],
        onread: [Function: onread],
        reading: true },
     _readableState:
      { highWaterMark: 16384,
        buffer: [],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: false,
        ended: false,
        endEmitted: false,
        reading: true,
        calledRead: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        objectMode: false,
        defaultEncoding: 'utf8',
        ranOut: false,
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: true,
     domain: null,
     _events:
      { end: [Object],
        finish: [Function: onSocketFinish],
        _socketEnd: [Function: onSocketEnd],
        drain: [Object],
        timeout: [Function],
        error: [Function],
        close: [Object] },
     _maxListeners: 10,
     _writableState:
      { highWaterMark: 16384,
        objectMode: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        decodeStrings: false,
        defaultEncoding: 'utf8',
        length: 0,
        writing: false,
        sync: false,
        bufferProcessing: false,
        onwrite: [Function],
        writecb: null,
        writelen: 0,
        buffer: [],
        errorEmitted: false },
     writable: true,
     allowHalfOpen: true,
     onend: [Function],
     destroyed: false,
     bytesRead: 9332,
     _bytesDispatched: 400197,
     _pendingData: null,
     _pendingEncoding: '',
     server:
      { domain: null,
        _events: [Object],
        _maxListeners: 10,
        _connections: 6,
        connections: [Getter/Setter],
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        allowHalfOpen: true,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _connectionKey: '4:0.0.0.0:9000' },
     _idleTimeout: 120000,
     _idleNext:
      { _connecting: false,
        _handle: [Object],
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: 10,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: true,
        onend: [Function],
        destroyed: false,
        bytesRead: 4015,
        _bytesDispatched: 83343,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _idleTimeout: 120000,
        _idleNext: [Object],
        _idlePrev: [Circular],
        _idleStart: 1405474471369,
        parser: [Object],
        ondata: [Function],
        _paused: false,
        _httpMessage: null },
     _idlePrev: { _idleNext: [Circular], _idlePrev: [Object] },
     _idleStart: 1405474483860,
     parser:
      { _headers: [],
        _url: '',
        onHeaders: [Function: parserOnHeaders],
        onHeadersComplete: [Function: parserOnHeadersComplete],
        onBody: [Function: parserOnBody],
        onMessageComplete: [Function: parserOnMessageComplete],
        socket: [Circular],
        incoming: [Circular],
        maxHeaderPairs: 2000,
        onIncoming: [Function] },
     ondata: [Function],
     _paused: false,
     _httpMessage:
      { domain: null,
        _events: [Object],
        _maxListeners: 10,
        output: [],
        outputEncodings: [],
        writable: true,
        _last: false,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _headerSent: false,
        _header: '',
        _hasBody: true,
        _trailer: '',
        finished: false,
        _hangupClose: false,
        socket: [Circular],
        connection: [Circular],
        _headers: [Object],
        _headerNames: [Object],
        req: [Circular],
        locals: {},
        flush: [Function: noop],
        write: [Function],
        end: [Function],
        on: [Function],
        writeHead: [Function],
        _livereload: true },
     _peername: { address: '127.0.0.1', family: 'IPv4', port: 56804 } },
  _consuming: true,
  _dumped: false,
  httpVersionMajor: 1,
  httpVersionMinor: 1,
  upgrade: false,
  originalUrl: '/api/fitnessData/weight',
  _parsedUrl:
   { protocol: null,
     slashes: null,
     auth: null,
     host: null,
     port: null,
     hostname: null,
     hash: null,
     search: null,
     query: null,
     pathname: '/weight',
     path: '/weight',
     href: '/weight' },
  params: {},
  query: {},
  res:
   { domain: null,
     _events: { finish: [Object], close: [Function: logRequest] },
     _maxListeners: 10,
     output: [],
     outputEncodings: [],
     writable: true,
     _last: false,
     chunkedEncoding: false,
     shouldKeepAlive: true,
     useChunkedEncodingByDefault: true,
     sendDate: true,
     _headerSent: false,
     _header: '',
     _hasBody: true,
     _trailer: '',
     finished: false,
     _hangupClose: false,
     socket:
      { _connecting: false,
        _handle: [Object],
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: 10,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: true,
        onend: [Function],
        destroyed: false,
        bytesRead: 9332,
        _bytesDispatched: 400197,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _idleTimeout: 120000,
        _idleNext: [Object],
        _idlePrev: [Object],
        _idleStart: 1405474483860,
        parser: [Object],
        ondata: [Function],
        _paused: false,
        _httpMessage: [Circular],
        _peername: [Object] },
     connection:
      { _connecting: false,
        _handle: [Object],
        _readableState: [Object],
        readable: true,
        domain: null,
        _events: [Object],
        _maxListeners: 10,
        _writableState: [Object],
        writable: true,
        allowHalfOpen: true,
        onend: [Function],
        destroyed: false,
        bytesRead: 9332,
        _bytesDispatched: 400197,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _idleTimeout: 120000,
        _idleNext: [Object],
        _idlePrev: [Object],
        _idleStart: 1405474483860,
        parser: [Object],
        ondata: [Function],
        _paused: false,
        _httpMessage: [Circular],
        _peername: [Object] },
     _headers: { 'x-powered-by': 'Express' },
     _headerNames: { 'x-powered-by': 'X-Powered-By' },
     req: [Circular],
     locals: {},
     flush: [Function: noop],
     write: [Function],
     end: [Function],
     on: [Function],
     writeHead: [Function],
     _livereload: true },
  next: [Function: next],
  body: { weight: '100' },
  _body: true,
  pipe: [Function],
  addListener: [Function],
  on: [Function],
  pause: [Function],
  resume: [Function],
  read: [Function],
  originalMethod: 'PUT',
  secret: undefined,
  cookies: { 'connect.sid': 's:d2ueS6nlFWy6jIcxPvla313j.uX8GogxjqUy5Bxd0EYiLj0nHS3syr+haMGVt6H1ucS8' },
  signedCookies: {},
  _passport:
   { instance:
      { _key: 'passport',
        _strategies: [Object],
        _serializers: [],
        _deserializers: [],
        _infoTransformers: [],
        _framework: [Object],
        _userProperty: 'user',
        Authenticator: [Function: Authenticator],
        Passport: [Function: Authenticator],
        Strategy: [Object],
        strategies: [Object] },
     session: {} },
  sessionStore:
   { db:
      { domain: null,
        _events: {},
        _maxListeners: 10,
        databaseName: 'fitstats-dev',
        serverConfig: [Object],
        options: [Object],
        _applicationClosed: false,
        slaveOk: false,
        bufferMaxEntries: -1,
        native_parser: undefined,
        bsonLib: [Object],
        bson: [Object],
        bson_deserializer: [Object],
        bson_serializer: [Object],
        _state: 'connected',
        pkFactory: [Object],
        forceServerObjectId: false,
        safe: false,
        notReplied: {},
        isInitializing: true,
        openCalled: true,
        commands: [],
        logger: [Object],
        tag: 1405474470484,
        eventHandlers: [Object],
        serializeFunctions: false,
        raw: false,
        recordQueryStats: false,
        retryMiliSeconds: 1000,
        numberOfRetries: 60,
        readPreference: undefined },
     db_collection_name: 'sessions',
     _serialize_session: [Function: stringify],
     _unserialize_session: [Function: parse],
     _get_collection: [Function],
     _open_database: [Function],
     defaultExpirationTime: 1209600000,
     generate: [Function],
     _events: { disconnect: [Function], connect: [Function] },
     collection:
      { db: [Object],
        collectionName: 'sessions',
        internalHint: null,
        opts: {},
        slaveOk: false,
        serializeFunctions: false,
        raw: false,
        readPreference: 'primary',
        pkFactory: [Object],
        serverCapabilities: undefined } },
  sessionID: 'd2ueS6nlFWy6jIcxPvla313j',
  session:
   { cookie:
      { path: '/',
        _expires: null,
        originalMaxAge: null,
        httpOnly: true } },
  _startTime: Tue Jul 15 2014 18:34:43 GMT-0700 (PDT),
  _remoteAddress: '127.0.0.1',
  route: { path: '/weight', stack: [ [Object] ], methods: { put: true } } }
*/
