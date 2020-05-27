import * as FabricCAServices from 'fabric-ca-client';
import { IEnrollmentRequest, IRegisterRequest, TLSOptions } from 'fabric-ca-client';
import { ClientConfig, ClientHelper } from './helpers';
import { d, e } from '../../utils/logs';

export type UserParams = IRegisterRequest;
export type AdminParams = IEnrollmentRequest;

/**
 * Class responsible to create user & admin accounts
 */
export class Membership extends ClientHelper {
  /* instance of the CA service*/
  public ca: FabricCAServices;

  /**
   * Constructor
   * @param config
   */
  constructor(public config: ClientConfig) {
    super(config);
  }

  /**
   * build and initialize the {@link FabricCAServices} instance
   * @param caName the name of the CA (provided in the deployment configuration file
   * @param isSecure boolean for the CA TLS connection
   */
  async initCaClient(caName?: string, isSecure = false) {
    await super.init();

    // set the CA instance
    // @ts-ignore
    const caInfo = this.clientConfig.networkProfile?.certificateAuthorities[caName ?? 0];
    const caUrl = caInfo.url;
    const caname = caInfo.caName;

    // read the ca pem certificate
    const caTlsCertPath = caInfo.tlsCACerts.path;
    const options = isSecure ? await this._getCATlsOptions(caTlsCertPath) : null;

    this.ca = new FabricCAServices(caUrl, options, caname);
  }

  /**
   * Enroll the admin account
   */
  async enrollCaAdmin(): Promise<boolean> {
    try {
      // check if the admin exists & enrolled in the Wallet
      const adminIdentity = await this.wallet.getIdentity(this.clientConfig.admin.name);
      if (adminIdentity) {
        d(`An identity for the admin user (${this.clientConfig.admin.name}) already exists in the wallet`);
        return;
      }

      // enroll the admin account
      const { key, certificate } = await this.ca.enroll({
        enrollmentID: this.clientConfig.admin.name,
        enrollmentSecret: this.clientConfig.admin.secret
      });

      // import the identity into the wallet
      await this.wallet.addIdentity(this.clientConfig.admin.name, this.client.getMspid(), key, certificate);
      d(`Successfully enrolled admin user "${this.clientConfig.admin.name} and imported it into the wallet`);

      return true;
    } catch (err) {
      e(`Failed to enroll admin user "admin": ${err}`);
      return false;
    }
  }

  /**
   * Add a new user account
   * @param params
   * @param mspId
   */
  async addUser(params: UserParams, mspId: string): Promise<boolean> {
    try {
      // check if the user exists
      const userIdentity = await this.wallet.getIdentity(params.enrollmentID);
      if (userIdentity) {
        d(`An identity for the user (${params.enrollmentID}) already exists`);
        return false;
      }

      // check if the admin account exists
      const adminIdentity = await this.wallet.getIdentity(this.clientConfig.admin.name);
      if (!adminIdentity) {
        d(`An identity of the admin user (${this.clientConfig.admin.name}) does not exists in the wallet`);
        d('Check if admin account is already enrolled');
        return false;
      }

      // build a user object to interact with the CA
      const provider = this.wallet.getWallet().getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, this.clientConfig.admin.name);

      // register the user, enroll the user and import into the wallet
      // @ts-ignore
      const enrollmentSecret = await this.ca.register(params, adminUser);
      const { key, certificate } = await this.ca.enroll({ enrollmentSecret, enrollmentID: params.enrollmentID });

      // store the new identity in the wallet
      await this.wallet.addIdentity(params.enrollmentID, this.client.getMspid(), key, certificate);
      d(`Successfully add user "${params.enrollmentID} and imported it into the wallet`);

      return true;
    } catch (err) {
      e(`Failed to add user "${params.enrollmentID}": ${err}`);
      return false;
    }
  }

  /**
   * Build the FabricCaService TLS options to connect
   * @param caTlsCertPath
   * @private
   */
  private async _getCATlsOptions(caTlsCertPath: string): Promise<TLSOptions> {
    const caTlsCertData = await this.readSingleFileInDir(caTlsCertPath);
    const caRoots = Buffer.from(caTlsCertData);

    return {
      trustedRoots: caRoots,
      verify: false
    };
  }
}
