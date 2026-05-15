// --- CONFIGURAZIONE BEACON ---
// Inserisci qui i valori del tuo iBeacon
const BEACON_UUID = "12345678-1234-1234-1234-1234-1234567890ab".toLowerCase();
const BEACON_MAJOR = 1;
const BEACON_MINOR = 1;

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

            // Controllo se è il nostro beacon
            if (uuid === BEACON_UUID && major === BEACON_MAJOR && minor === BEACON_MINOR) {
                console.log("Beacon CRF-UD rilevato!");

                // Apri il lettore QR
                openQRScanner();
            }
        });

    } catch (error) {
        console.error("Errore scansione BLE:", error);
        alert("Impossibile avviare la scansione Bluetooth. Controlla i permessi.");
    }
}

// --- APERTURA LETTORE QR ---
function openQRScanner() {
    alert("Beacon rilevato! Ora apro il lettore QR...");
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

