try {
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "User not found" });