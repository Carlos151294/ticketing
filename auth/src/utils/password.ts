import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const N_BYTES = 8;

export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(N_BYTES).toString('hex');
    const buffer = (await scryptAsync(password, salt, Math.pow(N_BYTES, 2))) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(suppliedPassword, salt, Math.pow(N_BYTES, 2))) as Buffer;

    return buffer.toString('hex') === hashedPassword;
  }
}