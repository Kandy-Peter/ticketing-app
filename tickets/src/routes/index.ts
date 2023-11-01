import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest, NotFoundError, BadRequestError } from "@kandy-peter/common";

import { Ticket } from "../models/ticket";

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

  res.status(201).send({
    message: "Ticket created successfully",
    data: newTicket
  });
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
