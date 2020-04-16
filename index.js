import { EtherPortClient } from 'etherport-client';
import five from 'johnny-five';

const ledStripBoard1 = new five.Board({
  port: new EtherPortClient({
    host: '192.168.1.157',
    port: 3030,
  }),
  repl: false,
});

const LED_PIN = 2;

ledStripBoard1.on('ready', () => {
  ledStripBoard1.pinMode(LED_PIN, five.Pin.OUTPUT);
  // the Led class was acting hinky, so just using Pin here
  const pin = five.Pin(LED_PIN);
  let value = 0;
  setInterval(() => {
    if (value) {
      pin.high();
      value = 0;
    } else {
      pin.low();
      value = 1;
    }
  }, 500);
});
