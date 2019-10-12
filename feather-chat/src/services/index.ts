import { Application } from '../declarations';
import users from './users/users.service';

import messages from './messages/messages.service';

export default function (app: Application) {
  app.configure(users);
  app.configure(messages);
}
