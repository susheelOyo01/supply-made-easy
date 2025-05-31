# Project Practices and Structure

This document outlines the best practices and project structure to be followed in this repository.

## Best Practices

- **Modularize the code:**
  - Break down code into reusable modules to promote maintainability and clarity.
- **Database Connections:**
  - Create separate modules for each database connection.
  - Implement `get` functions to retrieve common credentials from each respective database.
- **Dependency Management:**
  - Use a single root `package.json` file to manage all dependencies used across the project.
  - Avoid creating individual `package.json` files for each script or folder.

## Recommended Project Structure

```
root/
├── node_modules/
├── .gitignore
├── .env
├── package.json
├── Database_details/
├── SharedCode/
├── mrc-sync.js
├── clear-property-cache.js
├── crs-numeral-id.js
├── ... (other scripts)
```

- All code should reside in the root directory or organized subfolders as shown above.
- Shared code and utilities should be placed in the `SharedCode/` directory.
- Database connection details and related logic should be placed in the `Database_details/` directory.
- This structure ensures that all scripts can easily import and use shared functions, reducing code duplication and improving maintainability.

# Got a flaw in room_dimension_update code the code is not containing the country name so we cant search from country name or code in room-category table case  
-| Fixed - joined two tables room-category-amenity-list which contains property id with all room-category id and room-categories with name and room-category joined the tables to get a single id and done!

## Next Steps for Automation

- **Automate property publish failure status update:**
  - Automate the process for updating `propety_publish_failed` status to `1` (rs-updation).
- **Contact Page Automation:**
  - For contacts that are verified but have no details, set `substatus` to `1` and update the number and email fields accordingly.

- [x] **Mark Images Inactive:**
  - Mark image priority as inactive
  - Status: Completed ✅
  - Implementation: `inactive_crs_images.js`

# Automating contract update
- Find the easy way to find the latest contact id.