import axios from "axios";
import fs from "fs";

const DEFAULT_BATCH_SIZE = 10;

class TicketResolver {
    constructor(batchSize = DEFAULT_BATCH_SIZE) {
        this.baseUrl = 'https://seek.oyorooms.com/tmscore/v2/get_filtered_tickets';
        this.headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Referer': 'https://seek.oyorooms.com/tickets',
            'User-Agent': 'Mozilla/5.0',
            'time_zone': 'Asia/Calcutta',
            'Cookie': 'ssoToken=ssoIdTTJRellXVTJNakF0TTJKaE9TMDBOMkUwTFRneE9UWXRNVEJtWm1Oa05HVTNORGN6'
        };
        this.tickets = [];
        this.currentPage = 1;
        this.batchSize = batchSize;
        this.interval = 10000; // 10 seconds in milliseconds
    }

    // Build query parameters for the API request
    buildQueryParams(pageOffset) {
        const params = new URLSearchParams({
            pageOffSet: pageOffset,
            batchSize: this.batchSize,
            group_id: '159176',
            status: '0,1',
            createdFrom: '60',
            from_date: '1747852200000',
            to_date: '1750616999999',
            created_from_date: '1747852200000',
            created_to_date: '1750616999999',
            sortField: 'updatedAt',
            sortType: '1',
            isSpamTicket: 'false',
            locale: 'en'
        });
        return params.toString();
    }

    // Extract ticket ID and description from ticket data
    extractTicketData(ticket) {
        return {
            ticketId: ticket.ticket_id,
            description: ticket.description
        };
    }

    // Make API request for a specific page
    async fetchTickets(pageOffset) {
        try {
            const queryParams = this.buildQueryParams(pageOffset);
            const url = `${this.baseUrl}?${queryParams}`;
            
            console.log(`Fetching tickets for page ${pageOffset}...`);
            
            const response = await axios.get(url, { headers: this.headers });
            
            if (response.data.meta.status === 'success' && response.data.data.tickets) {
                const tickets = response.data.data.tickets;
                console.log(`Received ${tickets.length} tickets from page ${pageOffset}`);
                
                // Extract ticket ID and description from each ticket
                const extractedTickets = tickets.map(ticket => this.extractTicketData(ticket));
                this.tickets.push(...extractedTickets);
                
                return tickets.length; // Return number of tickets received
            } else {
                console.error('API response indicates failure:', response.data.meta);
                return 0;
            }
        } catch (error) {
            console.error(`Error fetching tickets for page ${pageOffset}:`, error.message);
            return 0;
        }
    }

    // Wait for specified interval
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fetch up to a specific number of tickets
    async fetchTicketsCount(totalTickets = 10) {
        const numBatches = Math.ceil(totalTickets / this.batchSize);
        console.log('Starting ticket data collection...');
        console.log(`Batch size: ${this.batchSize}, Total tickets requested: ${totalTickets}, Number of batches: ${numBatches}, Interval: ${this.interval/1000} seconds`);
        let pageOffset = 1;
        let totalTicketsFetched = 0;
        for (let i = 0; i < numBatches; i++) {
            const ticketsReceived = await this.fetchTickets(pageOffset);
            if (ticketsReceived === 0) {
                console.log('No more tickets found or error occurred. Stopping...');
                break;
            }
            totalTicketsFetched += ticketsReceived;
            console.log(`Total tickets collected so far: ${totalTicketsFetched}`);
            if (ticketsReceived < this.batchSize) {
                console.log('Reached end of ticket data.');
                break;
            }
            if (i < numBatches - 1) {
                console.log(`Waiting ${this.interval/1000} seconds before next request...`);
                await this.wait(this.interval);
            }
            pageOffset++;
        }
        // Trim to the requested number of tickets
        if (this.tickets.length > totalTickets) {
            this.tickets = this.tickets.slice(0, totalTickets);
        }
        console.log(`\n=== TICKET COLLECTION COMPLETED ===`);
        console.log(`Total tickets collected: ${this.tickets.length}`);
        return this.tickets;
    }

    // Get all collected tickets
    getAllTickets() {
        return this.tickets;
    }

    // Get tickets by ticket ID
    getTicketById(ticketId) {
        return this.tickets.find(ticket => ticket.ticketId === ticketId);
    }

    // Get tickets containing specific text in description
    getTicketsByDescription(searchText) {
        return this.tickets.filter(ticket => 
            ticket.description.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    // Display summary of collected tickets
    displaySummary() {
        console.log('\n=== TICKET SUMMARY ===');
        console.log(`Total tickets: ${this.tickets.length}`);
        
        if (this.tickets.length > 0) {
            console.log('\nFirst 5 tickets:');
            this.tickets.slice(0, 5).forEach((ticket, index) => {
                console.log(`${index + 1}. Ticket ID: ${ticket.ticketId}`);
                console.log(`   Description: ${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}`);
                console.log('');
            });
            
            if (this.tickets.length > 5) {
                console.log(`... and ${this.tickets.length - 5} more tickets`);
            }
        }
    }

    // Save tickets to a JSON file
    saveToJson(filename = 'tickets.json') {
        fs.writeFileSync(filename, JSON.stringify(this.tickets, null, 2), 'utf-8');
        console.log(`Saved tickets to ${filename}`);
    }

    // Save tickets to a CSV file
    saveToCsv(filename = 'tickets.csv') {
        const header = 'ticketId,description\n';
        const rows = this.tickets.map(ticket => {
            // Escape quotes and newlines in description
            const desc = ticket.description.replace(/"/g, '""').replace(/\n/g, ' ');
            return `${ticket.ticketId},"${desc}"`;
        });
        fs.writeFileSync(filename, header + rows.join('\n'), 'utf-8');
        console.log(`Saved tickets to ${filename}`);
    }
}

// Example usage
async function main() {
    // Get totalTickets from command line arguments
    // Usage: node ticket-resolver.js [totalTickets]
    const totalTickets = parseInt(process.argv[2], 10) || 10;
    const resolver = new TicketResolver(); // uses default batch size
    try {
        // Fetch up to the requested number of tickets
        const tickets = await resolver.fetchTicketsCount(totalTickets);
        // Display summary
        resolver.displaySummary();
        // Save to files
        resolver.saveToJson();
        resolver.saveToCsv();
        // Example: Get a specific ticket
        if (tickets.length > 0) {
            const firstTicket = tickets[0];
            console.log(`\nExample - First ticket details:`);
            console.log(`Ticket ID: ${firstTicket.ticketId}`);
            console.log(`Description: ${firstTicket.description}`);
        }
        // Example: Search tickets by description
        const emailTickets = resolver.getTicketsByDescription('email');
        console.log(`\nTickets containing 'email' in description: ${emailTickets.length}`);
    } catch (error) {
        console.error('Error in main execution:', error);
    }
}

// Export the class for use in other modules
export default TicketResolver;

// Run the script if called directly
main().catch(error => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
});
