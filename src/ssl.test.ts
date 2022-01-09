import {createCertificates} from './ssl';
import {promises as fs} from 'fs';
import {tmpdir} from 'os';

describe('createCertificates', () => {
  it('must create certificates successfully', async () => {
    const dir = tmpdir();

    const certificate = await createCertificates(dir);

    await fs.stat(certificate.certificatePath);
    await fs.stat(certificate.keyPath);
  });
});
