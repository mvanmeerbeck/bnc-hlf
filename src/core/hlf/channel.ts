//
// import * as util from 'util';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as helper from './helper';
// import { channelTimeout } from '../../utils/constants';
// import { updateTimeout } from '../../utils/constants';
// import { ChannelEventHub, Peer, ProposalResponse, ChaincodeInvokeRequest, ChaincodeQueryRequest, ChannelInfo, ChannelRequest } from 'fabric-client';
//
// import {l, d, e } from '../../utils/logs';
//
// export async function createChannel(channelName, channelConfigPath, orgName) : Promise<Boolean> {
//    d(`====== Creating Channel ${channelName} ======`);
//   try {
//     // first setup the client for this org
//     let client = await helper.getClientForOrg(orgName);
//      d('Successfully got the fabric client for the organization ');
//
//     // read in the envelope for the channel config raw bytes
//     let envelope = fs.readFileSync(path.join(__dirname,'../', channelConfigPath));
//     // extract the channel config bytes from the envelope to be signed
//     let channelConfig = client.extractChannelConfig(envelope);
//
//     //Acting as a client in the given organization provided with "orgName" param
//     // sign the channel config bytes as "endorsement", this is required by
//     // the orderer's channel creation policy
//     // this will use the admin identity assigned to the client when the connection profile was loaded
//     let signature = client.signChannelConfig(channelConfig);
//
//     let request: ChannelRequest = {
//       config: channelConfig,
//       signatures: [signature],
//       name: channelName,
//       txId: client.newTransactionID(true) // get an admin based transactionID
//     };
//
//     // send to orderer
//     let response = await client.createChannel(request);
//     if (response && response.status === 'SUCCESS') {
//       d('Successfully created the channel.');
//       return true;
//     } else {
//       d(`\n!!!!!!!!! Failed to create the channel ${channelName} \'` +
//         '\' !!!!!!!!!\n\n');
//       return false;
//     }
//   } catch (err) {
//     d('Failed to initialize the channel: ' + err.stack ? err.stack :	err);
//     return false;
//   }
// }
//
// export async function joinChannel (channelName, peers, orgName) : Promise<Boolean> {
//    d('\n\n============ Join Channel start ============\n');
//   let errorMessage = null;
//   let allEventHubs = [];
//   try {
//      d('Calling peers in organization "%s" to join the channel');
//
//     // first setup the client for this org
//     let client = await helper.getClientForOrg(orgName);
//      d(`Successfully got the fabric client for the organization ${orgName}`);
//     let channel = client.getChannel(channelName);
//     if(!channel) {
//        d('No channel found ');
//       let message = util.format('Channel %s was not defined in the connection profile', channelName);
//       l(message);
//       throw new Error(message);
//     }
//     // next step is to get the genesis_block from the orderer,
//     // the starting point for the channel that we want to join
//     let request = {
//       txId : 	client.newTransactionID(true) //get an admin based transactionID
//     };
//
//     let genesisBlock = await channel.getGenesisBlock(request);
//
//     // tell each peer to join and wait 10 seconds
//     // for the channel to be created on each peer
//     let promises = [];
//     promises.push(new Promise(resolve => setTimeout(resolve, channelTimeout)));
//
//     let joinRequest = {
//       targets: peers, //using the peer names which only is allowed when a connection profile is loaded
//       txId: client.newTransactionID(true), //get an admin based transactionID
//       block: genesisBlock
//     };
//     let joinPromise = channel.joinChannel(joinRequest);
//     promises.push(joinPromise);
//     let results = await Promise.all(promises);
//     d(util.format('Join Channel R E S P O N S E : %j', results));
//
//     // lets check the results of sending to the peers which is
//     // last in the results array
//     let peersResults = results.pop();
//     // then each peer results
//     for(let i of peersResults) {
//       let peerResult = peersResults[i];
//       if (peerResult instanceof Error) {
//         errorMessage = util.format('Failed to join peer to the channel with error :: %s', peerResult.toString());
//         e(errorMessage);
//       } else if(peerResult.response && peerResult.response.status == 200) {
//          d(`Successfully joined peer to the channel ${channelName}`);
//       } else {
//         errorMessage = util.format('Failed to join peer to the channel %s',channelName);
//         e(errorMessage);
//       }
//     }
//   } catch(error) {
//     d('Failed to join channel due to error: ' + error.stack ? error.stack : error);
//     errorMessage = error.toString();
//   }
//
//   // need to shutdown open event streams
//   allEventHubs.forEach((eh) => {
//     eh.disconnect();
//   });
//
//   if (!errorMessage) {
//     let message = util.format(
//       'Successfully joined peers in organization %s to the channel:%s',
//       orgName, channelName);
//     l(message);
//     // build a response to send back to the REST caller
//     return true;
//   } else {
//     let message = util.format('Failed to join all peers to channel. cause:%s',errorMessage);
//     e(message);
//     // build a response to send back to the REST caller
//     return false;
//   }
// }
//
// export async function updateChannel(configUpdatePath, channelName, orgName) : Promise<Boolean> {
//   d('\n====== Updating Anchor Peers on ======\n');
//   let errorMessage = null;
//   try {
//     // first setup the client for this org
//     let client = await helper.getClientForOrg(orgName);
//     d('Successfully got the fabric client for the organization ');
//     let channel = client.getChannel(channelName);
//     if(!channel) {
//       let message = util.format('Channel %s was not defined in the connection profile', channelName);
//       l(message);
//       throw new Error(message);
//     }
//
//     // read in the envelope for the channel config raw bytes
//     let envelope = fs.readFileSync(path.join(__dirname,'../', configUpdatePath));
//     // extract the channel config bytes from the envelope to be signed
//     let channelConfig = client.extractChannelConfig(envelope);
//
//     //Acting as a client in the given organization provided with "orgName" param
//     // sign the channel config bytes as "endorsement", this is required by
//     // the orderer's channel creation policy
//     // this will use the admin identity assigned to the client when the connection profile was loaded
//     let signature = client.signChannelConfig(channelConfig);
//
//     let request = {
//       config: channelConfig,
//       signatures: [signature],
//       name: channelName,
//       txId: client.newTransactionID(true) // get an admin based transactionID
//     };
//
//     let promises = [];
//     let eventHubs = channel.getChannelEventHubsForOrg();
//     d(`found ${eventHubs.length} eventhubs for this organization ${orgName}`);
//     eventHubs.forEach((eh) => {
//       let anchorUpdateEventPromise = new Promise((resolve, reject) => {
//         d('anchorUpdateEventPromise - setting up event');
//         const eventTimeout = setTimeout(() => {
//           let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
//           e(message);
//           eh.disconnect();
//         }, updateTimeout);
//         eh.registerBlockEvent((block) => {
//             d(`The config update has been committed on peer ${eh.getPeerAddr()}`);
//             clearTimeout(eventTimeout);
//             resolve();
//           }, (err) => {
//             clearTimeout(eventTimeout);
//             e(err);
//             reject(err);
//           },
//           // the default for 'unregister' is true for block listeners
//           // so no real need to set here, however for 'disconnect'
//           // the default is false as most event hubs are long running
//           // in this use case we are using it only once
//           {unregister: true, disconnect: true}
//         );
//         eh.connect();
//       });
//       promises.push(anchorUpdateEventPromise);
//     });
//
//     let sendPromise = client.updateChannel(request);
//     // put the send to the orderer last so that the events get registered and
//     // are ready for the orderering and committing
//     promises.push(sendPromise);
//     let results = await Promise.all(promises);
//     d(util.format('------->>> R E S P O N S E : %j', results));
//     let response = results.pop(); //  orderer results are last in the results
//
//     if (response) {
//       if (response.status === 'SUCCESS') {
//         d(`Successfully update anchor peers to the channel ${channelName}`);
//       } else {
//         errorMessage = util.format('Failed to update anchor peers to the channel %s with status: %s reason: %s', channelName, response.status, response.info);
//         e(errorMessage);
//       }
//     } else {
//       errorMessage = util.format('Failed to update anchor peers to the channel %s', channelName);
//       e(errorMessage);
//     }
//
//   } catch (error) {
//     e('Failed to update anchor peers due to error: ' + error.stack ? error.stack :	error);
//     errorMessage = error.toString();
//   }
//
//   if (!errorMessage) {
//     let message = util.format(
//       'Successfully update anchor peers in organization %s to the channel \'%s\'',
//       orgName, channelName);
//     l(message);
//     const response = {
//       success: true,
//       message: message
//     };
//     d('SUCCESSFULLY updaated peers');
//     return true;
//   } else {
//     let message = util.format('Failed to update anchor peers. cause:%s',errorMessage);
//     e(message);
//     const response = {
//       success: false,
//       message: message
//     };
//     d('FAILED to update peers');
//     return false;
//   }
//
// }
