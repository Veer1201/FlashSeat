// stressTest.js - The Report Card Version
const URL = "http://localhost:3000/seats/book";
const SEAT_ID = 1; 
const TOTAL_USERS = 50; 

async function runAttack() {
    console.log(`🚀 LAUNCHING SILENT ATTACK: ${TOTAL_USERS} users vs Seat ${SEAT_ID}...`);

    const requests = [];

    for (let i = 1; i <= TOTAL_USERS; i++) {
        const request = fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seatId: SEAT_ID, userId: i })
        })
        .then(res => res.status) // Just get the status code (200, 409, 500)
        .catch(err => "NETWORK_ERROR");

        requests.push(request);
    }

    // Wait for all 50 to return
    const results = await Promise.all(requests);

    // Count the results
    let wins = 0;
    let losses = 0;
    let errors = 0;

    results.forEach(status => {
        if (status === 200) wins++;
        else if (status === 409) losses++;
        else errors++;
    });

    console.log("\n📊 FINAL REPORT CARD:");
    console.table({
        "Winner (Got Ticket)": wins,
        "Losers (Blocked)": losses,
        "Crashes/Errors": errors
    });

    if (wins === 1 && losses === 49) {
        console.log("✅ TEST PASSED: Perfect Concurrency Safety!");
    } else {
        console.log("❌ TEST FAILED: Check the numbers above.");
    }
}

runAttack();