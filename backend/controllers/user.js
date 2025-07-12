@@ .. @@
   const { email, password, skills = [] } = req.body;
   try {
   }
-    const hashed = brcypt.hash(password, 10);
+    const hashed = await brcypt.hash(password, 10);
     const user = await User.create({ email, password: hashed, skills });