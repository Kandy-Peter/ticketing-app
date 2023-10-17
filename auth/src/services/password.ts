import bcryptjs from "bcryptjs";
import { promisify } from "util";

const hash = promisify(bcryptjs.hash);

export class Password {
  static async toHash(password: string) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const isMatch = await bcryptjs.compare(suppliedPassword, storedPassword);
    return isMatch;
  }
}
