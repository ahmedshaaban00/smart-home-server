import { EtherPortClient } from 'etherport-client';
import { Firmata } from 'firmata-io';
import colors from 'colors';
import { promiseWithTimeout } from './utils';

export default class Board {
  constructor({ name = 'Unknown', host, port, autoconnect = 3000 }) {
    if (!host || !port) {
      throw new Error('Host and port are required!');
    }

    this._sp = new EtherPortClient({
      host,
      port,
      reconnectTimeout: 1,
    });

    this._instance = new Firmata(this._sp, { reportVersionTimeout: 1 });
    this._instance.name = name;

    this._connected = false;
    this._connectionNumbers = 0;
    this._autoconnect_interval = autoconnect;

    this.onReady = this.onReady.bind(this);
    this._monitorConnection = this._monitorConnection.bind(this);
    this.unMount = () => {};

    this._attachConnectListeners();

    this._log('Initializing...');
  }

  onReady(readyCallback) {
    const that = this;
    this._instance.on('ready', () => {
      that.unMount = readyCallback(that._instance);
      that._log('Ready!', 'SUCCESS');
    });
  }

  _attachConnectListeners() {
    const that = this;
    this._instance.on('connect', function () {
      that._connected = true;
      that._monitorConnection();
      if (that._connectionNumbers > 0) {
        that._log('Reconnected!', 'SUCCESS');
        that._connectionNumbers += 1;
        that._instance.emit('ready');
      } else {
        that._log('Connected!', 'SUCCESS');
        that._connectionNumbers += 1;
        // AUTO CONNECT PING
        setInterval(function () {
          that._instance.sysexCommand([0]);
        }, that._autoconnect_interval);
      }
    });
  }

  // Keep Checking for connection status. (Goal is to find a dropped connection)
  _monitorConnection() {
    ((that) => {
      promiseWithTimeout(
        () =>
          new Promise((resolve) => {
            that._instance.reportVersion(() => {
              resolve('CONNECTED');
            });
          }),
        that._autoconnect_interval
      )
        .then(() => {
          setTimeout(that._monitorConnection, that._autoconnect_interval); // Delay for another connection check
        })
        .catch(() => {
          that._log('Disconnected. Trying to connect...', 'ERROR');
          that.unMount();
          if (that._connectionNumbers > 1) that._log('Unmounted.');
          // eslint-disable-next-line no-param-reassign
          that._connected = false;
        });
    })(this);
  }

  // Handling Logs: message(string), type(SUCCESS, ERROR)
  _log(message, type) {
    let color;
    switch (type) {
      case 'SUCCESS':
        color = 'green';
        break;
      case 'ERROR':
        color = 'red';
        break;
      default:
        color = 'white';
    }

    console.log(
      `Board ${colors.bold.magenta(this._instance.name)}: ${colors[color](
        message
      )}`
    );
  }
}
