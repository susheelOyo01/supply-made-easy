# Seek Ticket Resolver

This script fetches ticket data from the Seek API in batches and stores ticket ID and description information.

## Features

- Fetches tickets in batches of 10 (configurable)
- Waits 10 seconds between API requests to avoid rate limiting
- Extracts only ticket ID and description from the response
- Handles pagination automatically
- Stores all ticket data in memory for further processing
- Provides utility methods to search and filter tickets
- Uses ES6 modules for modern JavaScript syntax

## Installation

1. Navigate to the seek-ticket-resolver directory:
```bash
cd seek-ticket-resolver
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

Run the script directly:
```bash
npm start
```

Or run with Node.js:
```bash
node ticket-resolver.js
```

### Programmatic Usage

```javascript
import TicketResolver from './ticket-resolver.js';

async function example() {
    const resolver = new TicketResolver();
    
    // Fetch all tickets
    const tickets = await resolver.fetchAllTickets();
    
    // Get all tickets
    const allTickets = resolver.getAllTickets();
    
    // Get a specific ticket by ID
    const ticket = resolver.getTicketById(9212913737);
    
    // Search tickets by description
    const emailTickets = resolver.getTicketsByDescription('email');
    
    // Display summary
    resolver.displaySummary();
}
```

## Configuration

You can modify the following parameters in the `TicketResolver` constructor:

- `batchSize`: Number of tickets to fetch per request (default: 10)
- `interval`: Time to wait between requests in milliseconds (default: 10000ms = 10 seconds)
- `headers`: API request headers including authentication

## API Response Format

The script expects the API to return data in this format:
```json
{
    "meta": {
        "status": "success",
        "code": 100
    },
    "data": {
        "tickets": [
            {
                "ticket_id": 9212913737,
                "description": "Ticket description..."
            }
        ]
    }
}
```

## Output

The script will:
1. Log progress as it fetches tickets
2. Display a summary of collected tickets
3. Store ticket data in the `tickets` array with format:
   ```javascript
   {
       ticketId: 9212913737,
       description: "Ticket description..."
   }
   ```

## Error Handling

- The script handles API errors gracefully
- If an API request fails, it will log the error and continue
- The script stops when no more tickets are available or an error occurs

## Next Steps

Once you have the ticket data, you can:
1. Filter tickets based on specific criteria
2. Send the filtered data to another API for status updates
3. Export the data to a file
4. Process tickets in batches for further operations

## Notes

- The script uses the provided authentication cookie for API access
- Make sure the authentication token is valid before running the script
- The script respects rate limiting by waiting between requests
- All ticket data is stored in memory, so be mindful of memory usage for large datasets
- Uses ES6 modules (import/export) for modern JavaScript syntax 