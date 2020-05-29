export class CaOptions {
  engineName?: string;
  number?: number;
  ports?: '7054';
  host?: string;
  user?: 'admin';
  password?: 'adminpw';
  isSecure?: false;
}

export class Ca {
  constructor(public name: string, public options: CaOptions) {}
}
