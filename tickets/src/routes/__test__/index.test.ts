import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

jest.mock("../../nats-wrapper");

describe("Test tickets route handler and ticket creation", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if an invalid title is provided", async () => {
    const cookie = await global.signin();
    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "", price: 10 })
      .expect(400);
    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ price: 10 })
      .expect(400);
  });

  it("returns an error if an invalid price is provided", async () => {
    const cookie = await global.signin();
    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "title", price: -10 })
      .expect(400);
    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "title" })
      .expect(400);
  });

  it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    const cookie = global.signin();
    expect(tickets.length).toEqual(0);
    const title = "title";
    const price = 20;
    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);
  });

  // it("publishes an event", async () => {
  //   const title = 'title';
  //   const price = 20;
  //   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price }).expect(201);
  //   expect(natsWrapper.client.publish).toHaveBeenCalled();
  // });
});

describe("Show ticket route handler", () => {
  it("should return the ticket if the ticket is found", async () => {
    const title = "title";
    const price = 20;
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);
    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.data.id}`)
      .send({})
      .expect(200);
    expect(ticketResponse.body.data.title).toEqual(title);
    expect(ticketResponse.body.data.price).toEqual(price);
  });

  it("should return a 404 if the ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).get(`/api/tickets/${id}`).send({});

    console.log(res.body);
    expect(res.status).toEqual(404);
  });
});

describe("List tickets route handler", () => {
  // it("has a route handler listening to /api/tickets for get requests", async () => {
  //   const response = await request(app).get("/api/tickets").send({});
  //   expect(response.status).not.toEqual(404);
  // });
  // it("returns a list of tickets", async () => {
  //   const title = 'title';
  //   const price = 20;
  //   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price }).expect(201);
  //   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price }).expect(201);
  //   await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price }).expect(201);
  //   const response = await request(app).get('/api/tickets').send({}).expect(200);
  //   expect(response.body.data.length).toEqual(3);
  // });
});
