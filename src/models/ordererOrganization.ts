import { Ca } from './ca';
import { Orderer } from './orderer';

export class OrdererOrganizationOptions {
  ca?: Ca;
  orderers?: Orderer[];
  domainName?: string;
  isSecure?: boolean;
}

export class OrdererOrganization {
  ca: Ca;
  orderers: Orderer[] = [];
  domainName: string;
  isSecure = false;

  constructor(public name: string, options?: OrdererOrganizationOptions) {
    if(options) {
      this.ca = options.ca;
      this.orderers = options.orderers ?? [];
      this.domainName = options.domainName;
      this.isSecure = options.isSecure ?? false;
    }
  }

  ordererFullName(orderer: Orderer): string {
    return `${orderer.name}.${this.domainName}`;
  }

  get caName(): string {
    return `${this.ca.name}.${this.name}`;
  }

  get mspName(): string {
    return `${this.name}MSP`;
  }

  get fullName(): string {
    return `${this.name}.${this.domainName}`;
  }
}
