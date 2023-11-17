import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest, NotFoundError, BadRequestError } from "@kandy-peter/common";

import { natsWrapper } from "../nats-wrapper";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.post("/", requireAuth, [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
],
validateRequest,
async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const userId = req.currentUser!.id;

  const newTicket = Ticket.build({ title, price, userId });

  await newTicket.save();
  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
    userId: newTicket.userId
  });

  res.status(201).send({
    message: "Ticket created successfully",
    data: newTicket
  });
});

router.put("/:id", requireAuth, [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
],
validateRequest,
async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;
    const userId = req.currentUser!.id;

    const ticket = await Ticket.findById(id);

    if(!ticket){
      throw new NotFoundError();
    }

    if(ticket.userId !== userId){
      throw new BadRequestError("You are not authorized to edit this ticket");
    }

    ticket.set({ title, price });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.status(200).send({
      message: "Ticket updated successfully",
      data: ticket
    });
  } catch (error: any) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if(!ticket){
      throw new NotFoundError();
    }

    res.status(200).send({
      message: "Ticket retrieved successfully",
      data: ticket
    });
  } catch (error: any) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
});

export { router as TicketRouters };
