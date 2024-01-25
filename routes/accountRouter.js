const express = require("express");
const { Accounts } = require("../db/models/models");
const { z } = require("zod");
const authMiddleWare = require("../middleware/middleware");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleWare, async (req, res) => {
  const userId = req.userId;
  try {
    const account = await Accounts.findOne({ userId: userId });
    return res.status(200).json({
      message: "balance fetched",
      balance: account.balance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/transfer", authMiddleWare, async (req, res) => {
  const transferBody = z.object({
    to: z.string(),
    amount: z.number(),
  });

  const { success } = transferBody.safeParse(req.body);

  const { to, amount } = req.body;

  if (!success) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  // Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const senderAccount = await Accounts.findOne({
    userId: req.userId,
  });

  if (senderAccount.balance < amount) {
    return res.status(400).json({
      message: "Insufficient Balance",
    });
  }

  const toAccount = await Accounts.findOne({ userId: to });
  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid sender account",
    });
  }

  try {
    // Debit
    await Accounts.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    // Credit
    await Accounts.updateOne(
      { userId: to },
      {
        $inc: {
          balance: amount,
        },
      }
    ).session(session);

    await session.commitTransaction();

    return res.status(200).json({
      message: "Transaction completed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
