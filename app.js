// ---------------------------------------------------------
// CONFIGURAZIONE BEACON MULTI-UFFICIO
// Inserisci qui gli UUID reali quando arrivano i beacon fisici
// ---------------------------------------------------------

const BEACONS = [
    { uuid: "2f234454-cf6d-4a0f-adf2-f4911baffa6", major: 1, minor: 1, ufficio: "Ufficio Viale Europa" },
    { uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", major: 1, minor: 1, ufficio: "Ufficio B" },
    { uuid: "cccccccc-cccc-cccc-cccc-cccccccccccc", major: 1, minor: 1, ufficio: "Ufficio C" }
];

// ---------------------------------------------------------
// CONFIGURAZIONE GOOGLE FORM
// Sostituisci questi due valori con i tuoi
// ---------------------------------------------------------

const FORM_ID = "INSERISCI_QUI_ID_DEL_FORM";
const ENTRY_ID = "INSERISCI_QUI_ENTRY_ID_DELLA_DOMANDA";

// ---------------------------------------------------------
// FUNZIONE PRINCIPALE DI SCANSIONE BEACON
// ---------------------------------------------------------

async function startBeaconScan() {
    try {
        console.log("Richiesta permessi Bluetooth...");

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

            // Cerca il beacon corrispondente
            const beaconTrovato = BEACONS.find(b =>
                b.uuid === uuid &&
                b.major === major &&
                b.minor === minor
            );

            if (beaconTrovato) {
                console.log("Beacon rilevato:", beaconTrovato.ufficio);
                apriGoogleForm(beaconTrovato.ufficio);
            }
        });

    } catch (error) {
        console.error("Errore scansione BLE:", error);
        alert("Impossibile avviare la scansione Bluetooth. Controlla i permessi.");
    }
}

// ---------------------------------------------------------
// APERTURA GOOGLE FORM PRECOMPILATO
// ---------------------------------------------------------

function apriGoogleForm(ufficio) {
    const url = `https://docs.google.com/forms/d/${FORM_ID}/viewform?usp=pp_url&entry.${ENTRY_ID}=${encodeURIComponent(ufficio)}`;

    console.log("Apro il form precompilato:", url);
    window.location.href = url;
}

// ---------------------------------------------------------
// AVVIO AUTOMATICO ALL'APERTURA DELLA PWA
// ---------------------------------------------------------

window.addEventListener("load", () => {
    if ("bluetooth" in navigator) {
        startBeaconScan();
    } else {
        alert("Il tuo dispositivo non supporta il Bluetooth.");
    }
});
