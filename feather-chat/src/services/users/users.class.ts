import { Db } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import { Params } from "express-serve-static-core";
import crypto from "crypto";
// The Gravatar image service
const gravatarUrl = "https://s.gravatar.com/avatar";
// The size query. Our chat needs 60px images
const query = "s=60";

interface UserData {
  _id?: string;
  email: string;
  password: string;
  avatar?: string;
  githubId?: string;
}

export class Users extends Service {
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then(db => {
      this.Model = db.collection("users");
    });
  }

  async create(data: UserData, params?: Params) {
    const { email, password, githubId } = data;
    const hash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");
    // The full avatar URL
    const avatar = `${gravatarUrl}/${hash}?${query}`;
    // The complete user
    const userData = {
      email,
      password,
      githubId,
      avatar
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params);
  }
}
