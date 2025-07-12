@@ .. @@
 export const authenticate = (req, res, next) => {
 }
-  const token = req.headers.authorization?.spilt(" ")[1];
+  const token = req.headers.authorization?.split(" ")[1];