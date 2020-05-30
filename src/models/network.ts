/* tslint:disable:no-inferrable-types */
import { Organization } from './organization';
import { Channel } from './channel';
import { User } from './user';
import { ConsensusType, EXTERNAL_HLF_VERSION, HLF_VERSION } from '../utils/constants';

export class NetworkOptions {
  hyperledgerVersion?: HLF_VERSION;
  externalHyperledgerVersion?: EXTERNAL_HLF_VERSION;
  inside?: boolean = false;
  networkConfigPath?: string;
  consensus?: ConsensusType;
}

/**
 *
 * @author wassim.znaidi@gmail.com
 */
export class Network {
  organizations: Organization[] = [];
  channels: Channel[];

  constructor(public path: string, public options: NetworkOptions) {}

  async init() {
    return;
  }

  buildNetwork() {
    return;
  }

  buildFromSave(organizations: Organization[] = [], channels: Channel[] = []) {
    this.organizations = organizations;
    this.channels = channels;
  }

  async buildNetworkFromFile(networkConfigPath: string) {
    return;
  }

  initChannels(config: any) {
    return;
  }

  initOrgs(config: any) {
    return;
  }
}
