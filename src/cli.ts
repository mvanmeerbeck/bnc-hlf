/*
Copyright 2020 IRT SystemX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* tslint:disable:no-unused-variable */
import {Orchestrator} from './orchestrator';
import { Type_User }  from './utils/constants';

/**
 *
 * @author wassim.znaidi@gmail.com
 * @author sahar
 * @author ahmed
 */
export class CLI {
  static async validateAndParse(configFilePath: string, skipDownload?: boolean) {
    const orchEngine = new Orchestrator();
    await orchEngine.validateAndParse(configFilePath, skipDownload);
    return orchEngine;
  }

  static async generatePeersCredentials(configFilePath: string) {
    const orchEngine = new Orchestrator();
    await orchEngine.generatePeersCredentials(configFilePath);
    return orchEngine;
  }

  static async deployHlfContainers(configFilePath: string, skipDownload?: boolean, enablePeers = true, enableOrderers = true) {
    const orchEngine = new Orchestrator();
    await orchEngine.deployHLFContainers(configFilePath, skipDownload, enablePeers, enableOrderers);
    return orchEngine;
  }

  static async createNetwork(configFilePath: string) {
    const orchEngine = new Orchestrator();
    await orchEngine.initNetwork(configFilePath);
    return orchEngine;
  }

  static async cleanNetwork(rmi: boolean) {
    const orchEngine = new Orchestrator();
    await orchEngine.cleanDocker(rmi);
    return orchEngine;
  }

  /**
   * Generate the Configtx yaml file
   * @param configGenesisFilePath genesis configuration input file
   */
  static async generateConfigtx(configGenesisFilePath: string) {
    const orchEngine = new Orchestrator();
    await orchEngine.generateConfigtx(configGenesisFilePath);
    return orchEngine;
  }

  /**
   * Generate the genesis block file
   * @param configGenesisFilePath genesis configuration input file
   */
  static async generateGenesis(configGenesisFilePath: string) {
    const orchEngine = new Orchestrator();
    await orchEngine.generateGenesis(configGenesisFilePath);
    return orchEngine;
  }

  static async generateOrdererCredentials(configGenesisFilePath: string) {
    const orchEngine = new Orchestrator();
    await orchEngine.generateOrdererCredentials(configGenesisFilePath);
    return orchEngine;
  }

  static async enroll(type, id, secret, affiliation, mspID, caInfo, walletDirectoryName, ccpPath) {
    const enrollEngine = new Orchestrator();
    if(type == Type_User.admin){
      await enrollEngine.enroll(id, secret, mspID, caInfo, walletDirectoryName, ccpPath);
    } else {
      await enrollEngine.registerUser(id, secret, affiliation, mspID, caInfo, walletDirectoryName, ccpPath);
    }
  }

  static async fetchIdentity(id, caInfo, walletDirectoryName, ccpPath) {
    const enrollEngine = new Orchestrator();
    await enrollEngine.fetchIdentity(id, caInfo, walletDirectoryName, ccpPath);
  }

  static async deleteIdentity(id, caInfo, walletDirectoryName, ccpPath) {
    const enrollEngine = new Orchestrator();
    await enrollEngine.deleteIdentity(id, caInfo, walletDirectoryName, ccpPath);
  }

  // static async createChannel(channeltxPath, nameChannel, nameOrg) {
  //   const channelEngine = new Orchestrator();
  //   await channelEngine.createChannel(nameChannel, channeltxPath, nameOrg);
  //   return channelEngine;
  // }
  //
  // static async joinChannel(nameChannel, nameOrg, peers) {
  //   const channelEngine = new Orchestrator();
  //   await channelEngine.joinChannel(nameChannel, nameOrg, peers);
  //   return channelEngine;
  // }
  //
  // static async updateChannel(anchortx, namech, nameorg) {
  //   const channelEngine = new Orchestrator();
  //   await channelEngine.updateChannel(anchortx, namech, nameorg);
  //   return channelEngine;
  // }
}
