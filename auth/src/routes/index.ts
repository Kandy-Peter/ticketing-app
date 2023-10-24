import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user";
import { Password } from "../services/password";

import { validateRequest, currentUser, requireAuth, BadRequestError } from "@kandy-peter/common";

const router = express.Router();

router.get("/currentuser", currentUser, requireAuth, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      throw new BadRequestError("Email in use");
    }

    const newUser = UserModel.build({ email, password });

    await newUser.save();
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET_KEY!
    );

    req.session = {
      jwt: userJwt,
    } as any;

    res.status(201).send(newUser);
  }
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const isPasswordMatch = await Password.compare(user.password, password);

    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY!
    );

    req.session = {
      jwt: userJwt,
    } as any;

    res.status(200).send(user);
  }
);

router.post("/signout", (req: Request, res: Response) => {
  req.session = null as any;

  res.send({ message: "signed out successfully"});
});

export default router;
