@@ .. @@
       const data = await res.json();
-      setTickets(data.tickets || []);
+      setTickets(data || []);
     } catch (err) {