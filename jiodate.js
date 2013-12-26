
var YEAR = 'year';
var MONTH = 'month';
var DAY = 'day';
var HOUR = 'hour';
var MIN = 'minute';
var SEC = 'second';
var MSEC = 'millisecond';

var precision_grade = {
  'year': 0,
  'month': 1,
  'day': 2,
  'hour': 3,
  'minute': 4,
  'second': 5,
  'millisecond': 6
};

var lesserPrecision = function (p1, p2) {
  return (precision_grade[p1] < precision_grade[p2]) ? p1 : p2;
};


var JIODate = function (str) {
  // in case of forgotten 'new'
  if (!(this instanceof JIODate)) {
    return new JIODate(str);
  }

  if (str instanceof JIODate) {
    this.mom = str.mom.clone();
    this._precision = str._precision;
    return;
  }

  if (str === undefined) {
    this.mom = moment();
    this.setPrecision(MSEC);
    return;
  }

  this.mom = null;

  // http://www.w3.org/TR/NOTE-datetime
  // http://dotat.at/tmp/ISO_8601-2004_E.pdf

  // XXX these regexps fail to detect many invalid dates.

  if (str.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        || str.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d\.\d\d\d/)) {
    // ISO, milliseconds
    this.mom = moment(str);
    this.setPrecision(MSEC);
  } else if (str.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/)
        || str.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/)) {
    // ISO, seconds
    this.mom = moment(str);
    this.setPrecision(SEC);
  } else if  (str.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/)
        || str.match(/\d\d\d\d-\d\d-\d\d \d\d:\d\d/)) {
    // ISO, minutes
    this.mom = moment(str);
    this.setPrecision(MIN);
  } else if (str.match(/\d\d\d\d-\d\d-\d\d \d\d/)) {
    this.mom = moment(str);
    this.setPrecision(HOUR);
  } else if (str.match(/\d\d\d\d-\d\d-\d\d/)) {
    this.mom = moment(str);
    this.setPrecision(DAY);
  } else if (str.match(/\d\d\d\d-\d\d/)) {
    this.mom = moment(str);
    this.setPrecision(MONTH);
  } else if (str.match(/\d\d\d\d/)) {
    this.mom = moment(str);
    this.setPrecision(YEAR);
  }

  if (!this.mom) {
    throw new Error("Cannot parse: " + str);
  }

};


JIODate.prototype.setPrecision = function (prec) {
  this._precision = prec;
};


JIODate.prototype.getPrecision = function () {
  return this._precision;
};


JIODate.prototype.eq = function (other) {
  var p = lesserPrecision(this._precision, other._precision);
  return this.mom.isSame(other.mom, p);
};


JIODate.prototype.ne = function (other) {
  return (!this.eq(other));
};


JIODate.prototype.gt = function (other) {
  return this.mom.isAfter(other.mom, this._precision);
};


JIODate.prototype.lt = function (other) {
  return this.mom.isBefore(other.mom, this._precision);
};


JIODate.prototype.ge = function (other) {
  var m1 = this.mom, m2 = other.mom, p = this._precision;
  return m1.isAfter(m2, p) || m1.isSame(m2, p);
};


JIODate.prototype.le = function (other) {
  var m1 = this.mom, m2 = other.mom, p = this._precision;
  return m1.isBefore(m2, p) || m1.isSame(m2, p);
};


JIODate.prototype.cmp = function (other) {
  var m1 = this.mom, m2 = other.mom, p = this._precision;
  return m1.isBefore(m2, p) ? -1 : (m1.isSame(m2, p) ? 0 : +1);
};


JIODate.prototype.toPrecisionString = function (precision) {
  var fmt;
  
  precision = precision || this._precision;

  fmt = {
    'millisecond': 'YYYY-MM-DD HH:mm:ss.SSS',
    'second': 'YYYY-MM-DD HH:mm:ss',
    'minute': 'YYYY-MM-DD HH:mm',
    'hour': 'YYYY-MM-DD HH',
    'day': 'YYYY-MM-DD',
    'month': 'YYYY-MM',
    'year': 'YYYY'
  }[precision];

  if (!fmt) {
    throw new TypeError("Unsupported precision value '" + precision + "'");
  }

  return this.mom.format(fmt);
};


