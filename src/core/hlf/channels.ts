import { ClientConfig, ClientHelper } from './helpers';
import { d, e } from '../../utils/logs';
import { ensureFile } from 'fs-extra';
import * as fs from 'fs';
import { ChannelRequest, Orderer } from 'fabric-client';

export class Channels extends ClientHelper {
  public orderers: Orderer[];

  constructor(public config: ClientConfig) {
    super(config);
  }

  async init() {
    await super.init();
  }

  async createChannel(channelName: string, channelConfigPath: string): Promise<boolean> {
    try {
      // ensure the channel config path
      await ensureFile(channelConfigPath);

      // read in the envelope for the channel config raw bytes & extract
      let envelope = fs.readFileSync(channelConfigPath);
      let channelConfig = this.client.extractChannelConfig(envelope);

      //Acting as a client in the given organization provided with "orgName" param
      // sign the channel config bytes as "endorsement", this is required by
      // the orderer's channel creation policy
      // this will use the admin identity assigned to the client when the connection profile was loaded
      let signature = this.client.signChannelConfig(channelConfig);

      let request: ChannelRequest = {
        config: channelConfig,
        orderer: this.orderers[0],
        signatures: [signature],
        name: channelName,
        txId: this.client.newTransactionID(true) // get an admin based transactionID
      };

      // send to orderer
      let response = await this.client.createChannel(request);
      if (response && response.status === 'SUCCESS') {
        d('Successfully created the channel.');
        return true;
      }

      e(` Failed to create the channel ${channelName}`);
      return false;
    } catch (err) {
      e(`Exception while creating the channel ${channelName}`);
      e(err);
      return false;
    }
  }

  private async loadOrderersFromConfig() {
    const orderers = this.client.getConfigSetting('orderers');
    for(const key in orderers) {
      if(key) {
        const url = orderers[key].url;
        const sslTargetOverride = orderers[key].grpcOptions[' ssl-target-name-override'];

        // read the CA Certs root
        const caRootPath = orderers[key].tlsCACerts.path;
        const data = fs.readFileSync(caRootPath);
        const caRoots = Buffer.from(data).toString();
        const orderer = this.client.newOrderer(url, {
          'pem': caRoots,
          'ssl-target-name-override': sslTargetOverride
        });

        orderers.push(orderer);
      }

    }
  }

}
