import { exec as execWithoutPromise } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const exec = promisify(execWithoutPromise);

export interface Certificate {
  keyPath: string;
  certificatePath: string;
}

export async function createCertificates(tmpDir: string, hostname:string = os.hostname()): Promise<Certificate> {
  const keyPath = path.join(tmpDir, 'server.key');
  await exec(
    `openssl genrsa -des3 -out ${keyPath} -passout pass:temp 4096`
  );

  const signingRequestPath = path.join(tmpDir, 'server.csr');
  await exec(
    `openssl req -new -sha256 -key ${keyPath} -out ${signingRequestPath} -passin pass:temp -batch -subj "/OU=${hostname}"`
  );

  // remove the password
  await exec(
    `openssl rsa -in ${keyPath} -out ${keyPath} -passin pass:temp`
  );

  const certificatePath = path.join(tmpDir, 'server.crt');
  await exec(
    `openssl x509 -req -sha256 -days 3650 -in ${signingRequestPath} -signkey ${keyPath} -out ${certificatePath}`
  );

  return {
    keyPath,
    certificatePath,
  };
}
