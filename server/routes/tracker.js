const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

const habitScores = {
  "sleeping": 10,
  "exercising": 50,
  "junk food": -40,
  "reading": 30,
  "nothing": -20,
  "fighting": -50
};

const lifestyleScores = {
  "healthy": 50,
  "dont know": 0,
  "fighting": -40,
  "peaceful": 30,
  "nothing": -10
};

const challengeGoals = {
  "Early Riser": 40,
  "Fitness Streak": 70,
  "Digital Detox": 60,
  "Mindfulness Master": 50
};

const calculateScore = (habit, lifestyle) => {
  const habitScore = habitScores[habit.toLowerCase()] || 0;
  const lifestyleScore = lifestyleScores[lifestyle.toLowerCase()] || 0;
  let total = habitScore + lifestyleScore;

  if (total < 0) total = 0;
  if (total > 100) total = 100;

  return total;
};

router.post('/add', async (req, res) => {
  try {
    const { name, habits, lifestyle } = req.body;
    const score = calculateScore(habits, lifestyle);

    const newEntry = new Entry({
      name,
      habits,
      lifestyle,
      score,
      challengeJoined: false
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "Error adding entry" });
  }
});

router.get('/all', async (req, res) => {
  const entries = await Entry.find();
  res.json(entries);
});

router.post('/join-challenge/:id', async (req, res) => {
  const { challengeName } = req.body;
  const goal = challengeGoals[challengeName] || 100;

  await Entry.findByIdAndUpdate(req.params.id, {
    challengeJoined: true,
    challengeName,
    challengeGoal: goal
  });

  res.json({ message: 'Joined challenge' });
});

router.delete('/reset', async (req, res) => {
  await Entry.deleteMany({});
  res.json({ message: 'Reset done' });
});

module.exports = router;