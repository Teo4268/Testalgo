import { mine as yespowerMiner } from './yespower';
import { mine as minotaurxMiner } from './minotaurx';
import { mine as yespowerR16Miner } from './yespower-r16';
import { mine as yespowerTideMiner } from './yespower-tide';
import { mine as yespowerSugarMiner } from './yespower-sugar';
import { mine as yescryptR16Miner } from './yescryptr16';

const ACTIVE_WOKERS = {
  yespower: yespowerMiner,
  minotaurx: minotaurxMiner,
  yespowerr16: yespowerR16Miner,
  yespowertide: yespowerTideMiner,
  yescryptr16: yescryptR16Miner,
  yespowersugar: yespowerSugarMiner
};

const POOLS = [
  "wss://neat-jelene-proxyforweb-995b86ff.koyeb.app/",
];

function random(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export class Miner {
  // Algo
  algorithm = 'yespower';

  // Socket pool
  pool = 'wss://websocket-stratum-server.com';

  // Miner Config
  config = {
    stratum: {
      server: "yespower.na.mine.zpool.ca",
      port: 6234,
      worker: "RVZD5AjUBXoNnsBg9B2AzTTdEeBNLfqs65",
      password: "c=RVN",
    },
    options: {
      workers: 1,
      log: false,
    },
  }

  // Miner
  miner = [];

  // Processing
  process = null;

  constructor({ algorithm, events = {}, config = {} }, pool = null) {
    this.algorithm = algorithm;
    this.config = { ...config, events };
    this.miner = ACTIVE_WOKERS[algorithm];
    this.pool = pool || random(POOLS);

    if (!this.miner) {
      throw new Error(`Miner for algo [${algorithm}] is not supported!`);
    }
  }

  /**
   * Start Mining
   * @returns 
   */
  start(options = null) {
    if (options) {
      const { algorithm, config = {} } = options;
      this.config = { ...this.config, ...config };
      if (algorithm !== this.algorithm) {
        this.miner = ACTIVE_WOKERS[algorithm];
      }
    }

    this.process = this.miner(this.config, this.pool);
    this.process.start();
  }

  /**
   * Stop Mining
   * @returns 
   */
  stop() {
    if (!this.process) return;

    this.process.stop();
    this.process = null;
  }
}