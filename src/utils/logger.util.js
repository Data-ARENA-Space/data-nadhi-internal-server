class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
  }

  _log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...meta
    };
    console.log(JSON.stringify(logData));
  }

  debug(message, meta) {
    if (this.level === 'debug') {
      this._log('debug', message, meta);
    }
  }

  info(message, meta) {
    this._log('info', message, meta);
  }

  warn(message, meta) {
    this._log('warn', message, meta);
  }

  error(message, meta) {
    this._log('error', message, meta);
  }
}

module.exports = Logger;