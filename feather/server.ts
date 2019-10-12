import feathers from "@feathersjs/feathers";
import "@feathersjs/transport-commons";
import express from "@feathersjs/express";
import socketio from "@feathersjs/socketio";
import { urlencoded } from "body-parser";
import { Params } from "express-serve-static-core";

interface Message {
  id?: number;
  text: string;
}

class MessageService {
  messages: Message[] = [];
  async create(data: Pick<Message, "text">, params?: Params) {
    const newMessage: Message = {
      id: this.messages.length,
      text: data.text
    };

    this.messages.push(newMessage);

    return newMessage;
  }

  async find() {
    return this.messages;
  }
}

const app = express(feathers());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.configure(express.rest());
app.configure(socketio());
app.use("/messages", new MessageService());
app.use(express.errorHandler());
// Add any new real-time connection to the `everybody` channel
app.on("connection", connection => app.channel("everybody").join(connection));
// Publish all events to the `everybody` channel
app.publish(data => app.channel("everybody"));

// Start the server
app
  .listen(3030)
  .on("listening", () =>
    console.log("Feathers server listening on localhost:3030")
  );

// For good measure let's create a message
// So our API doesn't look so empty
app.service("messages").create({
  text: "Hello world from the server"
});
