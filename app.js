// --- CONFIGURAZIONE BEACON MULTI-UFFICIO ---
// Sostituisci gli UUID quando arrivano i beacon reali
const BEACONS = [
    { uuid: "2f234454-cf6d-4a0f-adf2-f4911baffa6", major: 1, minor: 1, ufficio: "Ufficio Viale Europa" },
    { uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", major: 1, minor: 1, ufficio: "Ufficio B" },
    { uuid: "cccccccc-cccc-cccc-cccc-cccccccccccc", major: 1, minor: 1, ufficio: "Ufficio C" }
];

// --- FUNZIONE PRINCIPALE ---
async function startBeaconScan() {
    try {
        console.log("Richiesta permessi Bluetooth...");

        // Richiesta permessi BLE
        const scan = await navigator.bluetooth.requestLEScan({
            filters: [{ services: [] }],
            keepRepeatedDevices: true
        });

        console.log("Permessi concessi. Scansione avviata.");

        navigator.bluetooth.addEventListener("advertisementreceived", event => {
            const uuid = event.uuid?.toLowerCase();
            const major = event.major;
            const minor = event.minor;

            console.log("Trovato dispositivo:", uuid, major, minor);

            // --- CONTROLLO MULTI-BEACON ---
            const beaconTrovato = BEACONS.find(b =>
                b.uuid === uuid &&
                b.major === major &&
                b.minor === minor
            );

            if (beaconTrovato) {
                console.log("Beacon autorizzato rilevato in:", beaconTrovato.ufficio);
                openQRScanner(beaconTrovato.ufficio);
            }
        });

    } catch (error) {
        console.error("Errore scansione BLE:", error);
        alert("Impossibile avviare la scansione Bluetooth. Controlla i permessi.");
    }
}

// --- APERTURA LETTORE QR ---
function openQRScanner(ufficio) {
    alert("Beacon rilevato in: " + ufficio + ". Apro il lettore QR...");
    window.location.href = "https://qrco.de/bcF1kP"; // <-- QUI METTI IL TUO QR SCANNER
}

// --- AVVIO AUTOMATICO ALL'APERTURA DELLA PWA ---
window.addEventListener("load", () => {
    if ("bluetooth" in navigator) {
        startBeaconScan();
    } else {
        alert("Il tuo dispositivo non supporta il Bluetooth.");
    }
});
