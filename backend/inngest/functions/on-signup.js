@@ .. @@
         return userObject;
       });

-      await setp.run("send-welcome-email", async () => {
+      await step.run("send-welcome-email", async () => {
         const subject = `Welcome to the app`;