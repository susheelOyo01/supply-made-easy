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

## Next Steps for Automation

- **Automate property publish failure status update:**
  - Automate the process for updating `propety_publish_failed` status to `1` (rs-updation).
- **Contact Page Automation:**
  - For contacts that are verified but have no details, set `substatus` to `1` and update the number and email fields accordingly.

-- **Mark Images Inactive:**
  - Mark image priority as inactive
