# Practices that I will follow in this repo

- modularize the code
- Firstly make each db connection code and write the get functions for comman credentail that has to be taken from the particular db.
- Rather than foldering up individual script make a root package.json file and put all the dependencies used in all the folders.

Create a structure like this
  root
 -node_modules
 -.gitignore
 -.env
 -package.json
 -Database_details/
 -SharedCode/
 -mrc-sync.js
 -clear-property-cache.js
 -crs-numeral-id.js
 -etc....

-In this way all the code will be in sync with eachother, each can use function of other and we do it will help in avoiding repetitive task.