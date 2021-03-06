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

export enum PeerDbType {
  Couchdb = 'couchdb',
  LevelDb = 'leveldb'
}

export enum AgentType {
  Docker = 'docker',
  Kubernetes = 'k8s'
}

export enum ConsensusType {
  RAFT = 'raft',
  KAFKA = 'kafka',
  SOLO = 'solo'
}

export enum HLF_VERSION {
  HLF_2 = '2.0.0',
  HLF_2_1 = '2.1.0'
}

export enum EXTERNAL_HLF_VERSION {
  EXT_HLF_2 = '0.4.18'
}

export enum HLF_CA_VERSION {
  HLF_2= '1.4.4'
}

export enum Type_User {
  admin = 'admin',
  user = 'user'
}

export enum DOCKER_DEFAULT {
  IP = '127.0.0.1',
  PORT = 2375
}

export enum HLF_CLIENT_ACCOUNT_ROLE {
  peer = 'peer',
  client = 'client',
  admin= 'admin',
  orderer = 'orderer',
}

export const enum HLF_WALLET_TYPE {
  FileSystem = 'filesystem',
  CouchDB = 'couchdb',
  Memory = 'memory'
}

export const ORDERER_DEFAULT_PORT = 7050;

export const GENESIS_FILE_NAME = 'genesis.block';
export const channelTimeout = 10000;
export const updateTimeout = 60000;
export const BNC_TOOL_NAME = 'BNC';
export const BNC_NETWORK = 'bnc_network';
export const DOCKER_CA_DELAY = 3000;

export const ENABLE_CONTAINER_LOGGING = true;
export const CHANNEL_NAME_DEFAULT = 'bnc-channel';
