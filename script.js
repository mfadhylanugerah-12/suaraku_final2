/* ========================================
   SUARAKU — script.js
   Semua logic: auth dummy, localStorage CRUD,
   filter kata kasar, render dashboard, dll.
   ======================================== */

/* ---------- KONFIGURASI & DATA DUMMY ---------- */

// Akun mahasiswa (front-end only)
const DUMMY_MAHASISWA_LIST = [
  { nim: "51024306", password: "Muhammad_Fadhyl_A", nama: "Muhammad Fadhyl A. P." },
  { nim: "51024351", password: "Syarifa_Kurniah",  nama: "Syarifa Kurniah" },
  { nim: "51024304", password: "David_Sanapang",   nama: "David Sanapang" },
  { nim: "51024004", password: "Fernando_Christian", nama: "Fernando Christian" }
];

const DUMMY_BEM = {
  username: "Syarifa_25",
  password: "SyarifaKharisma",
  nama: "Admin BEM"
};

// Daftar kata kasar sederhana untuk filter otomatis
const BAD_WORDS = [
  "anjing", "bangsat", "brengsek", "bajingan", "kontol", "memek",
  "tai", "goblok", "tolol", "idiot", "bodoh banget", "sialan",
  "asu", "babi", "keparat", "jancok", "kampret"
];

// Key localStorage
const LS_REPORTS = "suaraku_reports";
const LS_SESSION = "suaraku_session";

/* ---------- HELPER: LOCALSTORAGE ---------- */

// Versi seed — naikkan angka ini setiap kali seed data diubah
// agar browser lama otomatis mendapat data terbaru
const SEED_VERSION = 2;
const LS_SEED_VER  = "suaraku_seed_ver";

function getReports() {
  // Cek versi seed; kalau beda, reset localStorage dengan seed terbaru
  const savedVer = parseInt(localStorage.getItem(LS_SEED_VER) || "0", 10);
  const data = localStorage.getItem(LS_REPORTS);

  if (data && savedVer >= SEED_VERSION) return JSON.parse(data);

  const seed = [
    // ── Laporan milik Muhammad Fadhyl (51024306) ──────────────────
    {
      ticket: "SRK-2026-0001",
      nama: "Muhammad Fadhyl A. P.", nim: "51024306", _ownerNim: "51024306",
      anonim: false, kategori: "Fasilitas", jenis: "Aduan",
      judul: "AC ruang kelas lab 3 mati",
      isi: "AC di ruang kelas lab 3 sudah 2 minggu tidak berfungsi, membuat ruangan sangat panas saat praktikum siang.",
      files: [], status: "diproses", flagged: false, tanggal: "2026-06-24T09:12:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "24 Jun 2026, 09.12", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "24 Jun 2026, 09.12", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke Kemahasiswaan", time: "25 Jun 2026, 14.40", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Sedang dalam proses peninjauan oleh pihak kampus", time: "Estimasi selesai: 2-3 hari", done: false, active: true },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir dari Ketua STMIK Kharisma", time: "Belum diproses", done: false }
      ]
    },
    {
      ticket: "SRK-2026-0002",
      nama: "Muhammad Fadhyl A. P.", nim: "51024306", _ownerNim: "51024306",
      anonim: false, kategori: "Akademik", jenis: "Aspirasi",
      judul: "Usul jadwal UTS lebih fleksibel",
      isi: "Mohon agar penjadwalan UTS dan UAS lebih diperhatikan supaya tidak ada mata kuliah yang bertabrakan waktunya.",
      files: [], status: "pending", flagged: false, tanggal: "2026-06-26T10:00:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "26 Jun 2026, 10.00", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "26 Jun 2026, 10.00", done: true },
        { label: "Direview oleh BEM", desc: "Menunggu peninjauan dari BEM", time: "Belum diproses", done: false, active: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Menunggu hasil review BEM", time: "Belum diproses", done: false },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir dari Ketua STMIK Kharisma", time: "Belum diproses", done: false }
      ]
    },
    {
      ticket: "SRK-2026-0003",
      nama: "Muhammad Fadhyl A. P.", nim: "51024306", _ownerNim: "51024306",
      anonim: false, kategori: "Fasilitas", jenis: "Aduan",
      judul: "Wifi perpustakaan lambat saat jam ramai",
      isi: "Koneksi wifi di perpustakaan kerap melambat ketika banyak mahasiswa yang mengakses bersamaan, terutama jam siang.",
      files: [], status: "selesai", flagged: false, tanggal: "2026-06-18T08:30:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "18 Jun 2026, 08.30", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "18 Jun 2026, 08.30", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke Kemahasiswaan", time: "19 Jun 2026, 11.00", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Ditindaklanjuti oleh tim IT kampus", time: "20 Jun 2026, 09.00", done: true },
        { label: "Tindak Lanjut Selesai", desc: "Wifi telah diperbaiki dan berfungsi normal", time: "26 Jun 2026, 16.00", done: true }
      ]
    },
    // ── Laporan milik Syarifa Kurniah (51024351) ──────────────────
    {
      ticket: "SRK-2026-0004",
      nama: "Syarifa Kurniah", nim: "51024351", _ownerNim: "51024351",
      anonim: false, kategori: "Akademik", jenis: "Aspirasi",
      judul: "Penambahan referensi buku di perpustakaan",
      isi: "Mohon perpustakaan menambah koleksi buku referensi untuk mata kuliah Pemrograman Web dan Mobile, karena buku yang tersedia sangat terbatas dan sudah tidak relevan dengan kurikulum saat ini.",
      files: [], status: "diproses", flagged: false, tanggal: "2026-06-20T10:15:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "20 Jun 2026, 10.15", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "20 Jun 2026, 10.15", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke Kemahasiswaan", time: "21 Jun 2026, 09.00", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Sedang dikaji oleh pihak perpustakaan", time: "Estimasi selesai: 1 minggu", done: false, active: true },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    {
      ticket: "SRK-2026-0005",
      nama: "Syarifa Kurniah", nim: "51024351", _ownerNim: "51024351",
      anonim: false, kategori: "Layanan Kampus", jenis: "Saran",
      judul: "Usul pembukaan kantin hingga malam hari",
      isi: "Banyak mahasiswa yang mengikuti kelas malam tidak memiliki akses makanan karena kantin tutup sebelum jam 17.00. Mohon pertimbangkan untuk memperpanjang jam operasional kantin hingga pukul 20.00.",
      files: [], status: "pending", flagged: false, tanggal: "2026-07-01T08:30:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "1 Jul 2026, 08.30", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "1 Jul 2026, 08.30", done: true },
        { label: "Direview oleh BEM", desc: "Menunggu peninjauan dari BEM", time: "Belum diproses", done: false, active: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Menunggu hasil review BEM", time: "Belum diproses", done: false },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    // ── Laporan milik David Sanapang (51024304) ───────────────────
    {
      ticket: "SRK-2026-0006",
      nama: "David Sanapang", nim: "51024304", _ownerNim: "51024304",
      anonim: false, kategori: "Fasilitas", jenis: "Aduan",
      judul: "Proyektor di ruang C2 sering mati mendadak",
      isi: "Proyektor di ruang kelas C2 kerap mati tiba-tiba di tengah perkuliahan sehingga mengganggu proses belajar mengajar. Sudah terjadi lebih dari 5 kali dalam sebulan terakhir.",
      files: [], status: "selesai", flagged: false, tanggal: "2026-06-10T13:00:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "10 Jun 2026, 13.00", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "10 Jun 2026, 13.00", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke Kemahasiswaan", time: "11 Jun 2026, 10.00", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Tim teknis telah memeriksa dan mengganti unit proyektor", time: "15 Jun 2026, 14.00", done: true },
        { label: "Tindak Lanjut Selesai", desc: "Proyektor baru telah terpasang dan berfungsi normal", time: "20 Jun 2026, 09.00", done: true }
      ]
    },
    {
      ticket: "SRK-2026-0007",
      nama: "David Sanapang", nim: "51024304", _ownerNim: "51024304",
      anonim: false, kategori: "Akademik", jenis: "Saran",
      judul: "Perlu diadakan workshop pemrograman tambahan",
      isi: "Mengusulkan agar BEM bekerja sama dengan dosen mengadakan workshop pemrograman di luar jam kuliah, khususnya untuk topik React, Flutter, dan Laravel yang sangat dibutuhkan di dunia kerja saat ini.",
      files: [], status: "diproses", flagged: false, tanggal: "2026-06-28T11:45:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "28 Jun 2026, 11.45", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "28 Jun 2026, 11.45", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui, BEM akan menindaklanjuti", time: "29 Jun 2026, 09.30", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Sedang dalam koordinasi dengan program studi", time: "Estimasi selesai: 2 minggu", done: false, active: true },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    // ── Laporan milik Fernando Christian (51024004) ───────────────
    {
      ticket: "SRK-2026-0008",
      nama: "Fernando Christian", nim: "51024004", _ownerNim: "51024004",
      anonim: false, kategori: "Fasilitas", jenis: "Aduan",
      judul: "Toilet lantai 2 gedung A tidak berfungsi",
      isi: "Toilet di lantai 2 gedung A sudah lebih dari seminggu tidak bisa digunakan karena saluran air tersumbat. Mohon segera diperbaiki mengingat ini sangat mengganggu kenyamanan mahasiswa.",
      files: [], status: "selesai", flagged: false, tanggal: "2026-06-15T07:50:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "15 Jun 2026, 07.50", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "15 Jun 2026, 07.50", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke bagian sarana prasarana", time: "15 Jun 2026, 14.00", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Tim sarana prasarana telah menangani perbaikan", time: "17 Jun 2026, 10.00", done: true },
        { label: "Tindak Lanjut Selesai", desc: "Toilet sudah berfungsi normal kembali", time: "18 Jun 2026, 15.00", done: true }
      ]
    },
    {
      ticket: "SRK-2026-0009",
      nama: "Fernando Christian", nim: "51024004", _ownerNim: "51024004",
      anonim: false, kategori: "Layanan Kampus", jenis: "Aspirasi",
      judul: "Pengadaan layanan konseling mahasiswa",
      isi: "Mengusulkan agar kampus menyediakan layanan konseling psikologi bagi mahasiswa. Tekanan akademik yang tinggi membuat banyak mahasiswa membutuhkan dukungan mental yang profesional.",
      files: [], status: "pending", flagged: false, tanggal: "2026-07-03T09:20:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "3 Jul 2026, 09.20", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "3 Jul 2026, 09.20", done: true },
        { label: "Direview oleh BEM", desc: "Menunggu peninjauan dari BEM", time: "Belum diproses", done: false, active: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Menunggu hasil review BEM", time: "Belum diproses", done: false },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    // ── Laporan dari mahasiswa lain ───────────────────────────────
    {
      ticket: "SRK-2026-0010",
      nama: "Rizky Pratama", nim: "51024210", _ownerNim: "51024210",
      anonim: false, kategori: "Fasilitas", jenis: "Aduan",
      judul: "Kursi ruang kelas B3 banyak yang rusak",
      isi: "Banyak kursi di ruang B3 yang sudah rusak — patah atau goyang — sehingga tidak nyaman digunakan selama proses perkuliahan. Mohon segera diganti atau diperbaiki.",
      files: [], status: "diproses", flagged: false, tanggal: "2026-07-05T08:00:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "5 Jul 2026, 08.00", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "5 Jul 2026, 08.00", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke sarana prasarana", time: "6 Jul 2026, 10.00", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Sedang dalam proses pengadaan kursi baru", time: "Estimasi: 3-5 hari kerja", done: false, active: true },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    {
      ticket: "SRK-2026-0011",
      nama: "Nurul Hidayah", nim: "51024088", _ownerNim: "51024088",
      anonim: false, kategori: "Akademik", jenis: "Saran",
      judul: "Mohon diadakan kelas tambahan sebelum UAS",
      isi: "Sebagai persiapan menghadapi UAS, mohon dosen atau BEM bisa memfasilitasi kelas tambahan atau sesi tanya jawab khusus per mata kuliah agar mahasiswa lebih siap.",
      files: [], status: "pending", flagged: false, tanggal: "2026-07-08T14:00:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "8 Jul 2026, 14.00", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "8 Jul 2026, 14.00", done: true },
        { label: "Direview oleh BEM", desc: "Menunggu peninjauan dari BEM", time: "Belum diproses", done: false, active: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Menunggu hasil review BEM", time: "Belum diproses", done: false },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    {
      ticket: "SRK-2026-0012",
      nama: "Anonim", nim: "", _ownerNim: "",
      anonim: true, kategori: "Layanan Kampus", jenis: "Aduan",
      judul: "Pelayanan staf akademik kurang responsif",
      isi: "Pelayanan staf akademik kurang ramah dan lambat dalam merespon pertanyaan mahasiswa terkait administrasi.",
      files: [], status: "pending", flagged: false, tanggal: "2026-06-27T13:20:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "27 Jun 2026, 13.20", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "27 Jun 2026, 13.20", done: true },
        { label: "Direview oleh BEM", desc: "Menunggu peninjauan dari BEM", time: "Belum diproses", done: false, active: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Menunggu hasil review BEM", time: "Belum diproses", done: false },
        { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir", time: "Belum diproses", done: false }
      ]
    },
    {
      ticket: "SRK-2026-0013",
      nama: "Anonim", nim: "", _ownerNim: "",
      anonim: true, kategori: "Fasilitas", jenis: "Saran",
      judul: "Penambahan colokan listrik di area lobi",
      isi: "Area lobi kampus sangat ramai digunakan mahasiswa untuk belajar mandiri, namun colokan listrik sangat sedikit. Mohon ditambahkan setidaknya 10 titik colokan di area lobi.",
      files: [], status: "selesai", flagged: false, tanggal: "2026-06-05T10:00:00",
      timeline: [
        { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: "5 Jun 2026, 10.00", done: true },
        { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: "5 Jun 2026, 10.00", done: true },
        { label: "Direview oleh BEM", desc: "Laporan disetujui dan diteruskan ke sarana prasarana", time: "6 Jun 2026, 09.00", done: true },
        { label: "Ditinjau Kemahasiswaan", desc: "Tim teknis telah melakukan pemasangan colokan tambahan", time: "12 Jun 2026, 11.00", done: true },
        { label: "Tindak Lanjut Selesai", desc: "12 titik colokan baru telah terpasang di area lobi", time: "15 Jun 2026, 14.00", done: true }
      ]
    }
  ];

  localStorage.setItem(LS_REPORTS, JSON.stringify(seed));
  localStorage.setItem(LS_SEED_VER, String(SEED_VERSION));
  return seed;
}

function saveReports(reports) {
  localStorage.setItem(LS_REPORTS, JSON.stringify(reports));
}

function getSession() {
  const data = localStorage.getItem(LS_SESSION);
  return data ? JSON.parse(data) : null;
}

function setSession(session) {
  localStorage.setItem(LS_SESSION, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

/* ---------- HELPER: UI ---------- */

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = "toast show " + (type === "success" ? "toast-success" : "toast-error");
  setTimeout(() => {
    toast.className = "toast";
  }, 2800);
}

function formatTanggal(isoString) {
  const date = new Date(isoString);
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

function badgeClassForStatus(status) {
  switch (status) {
    case "pending": return "badge-pending";
    case "diproses": return "badge-process";
    case "selesai": return "badge-done";
    case "ditolak": return "badge-reject";
    case "expired": return "badge-expired";
    default: return "badge-pending";
  }
}

function labelForStatus(status) {
  switch (status) {
    case "pending": return "Menunggu";
    case "diproses": return "Diproses";
    case "selesai": return "Selesai";
    case "ditolak": return "Ditolak";
    case "expired": return "Tidak Ditindaklanjuti";
    default: return status;
  }
}

function containsBadWord(text) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}

function generateTicketId() {
  const reports = getReports();
  const nums = reports
    .map(r => parseInt(r.ticket.split("-")[2], 10))
    .filter(n => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `SRK-2026-${String(next).padStart(4, "0")}`;
}

/* ========================================
   LOGIN PAGE (login.html)
   ======================================== */

let currentLoginRole = "mahasiswa";

function switchRole(role) {
  currentLoginRole = role;
  const btnMhs = document.getElementById("btnRoleMahasiswa");
  const btnBem = document.getElementById("btnRoleBem");
  const formMhs = document.getElementById("formLoginMahasiswa");
  const formBem = document.getElementById("formLoginBem");
  const warning = document.getElementById("loginWarning");

  if (warning) warning.classList.remove("show");

  if (role === "mahasiswa") {
    btnMhs.classList.add("active");
    btnBem.classList.remove("active");
    formMhs.style.display = "block";
    formBem.style.display = "none";
  } else {
    btnBem.classList.add("active");
    btnMhs.classList.remove("active");
    formBem.style.display = "block";
    formMhs.style.display = "none";
  }
}

function handleLoginMahasiswa(event) {
  event.preventDefault();
  const nim = document.getElementById("nim").value.trim();
  const pass = document.getElementById("passMahasiswa").value.trim();
  const warning = document.getElementById("loginWarning");
  const warningText = document.getElementById("loginWarningText");

  const found = DUMMY_MAHASISWA_LIST.find(m => m.nim === nim && m.password === pass);
  if (found) {
    setSession({ role: "mahasiswa", nim: found.nim, nama: found.nama });
    window.location.href = "dashboard-mahasiswa.html";
  } else {
    warningText.textContent = "NIM atau password salah. Coba lagi.";
    warning.classList.add("show");
  }
}

function handleLoginBem(event) {
  event.preventDefault();
  const username = document.getElementById("usernameBem").value.trim();
  const pass = document.getElementById("passBem").value.trim();
  const warning = document.getElementById("loginWarning");
  const warningText = document.getElementById("loginWarningText");

  if (username === DUMMY_BEM.username && pass === DUMMY_BEM.password) {
    setSession({ role: "bem", username: DUMMY_BEM.username, nama: DUMMY_BEM.nama });
    window.location.href = "dashboard-bem.html";
  } else {
    warningText.textContent = "Username atau password salah. Coba lagi.";
    warning.classList.add("show");
  }
}

function handleLogout() {
  clearSession();
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const quickFillLink = document.getElementById("quickFillLink");
  if (quickFillLink) {
    quickFillLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentLoginRole === "mahasiswa") {
        document.getElementById("nim").value = DUMMY_MAHASISWA_LIST[0].nim;
        document.getElementById("passMahasiswa").value = DUMMY_MAHASISWA_LIST[0].password;
      } else {
        document.getElementById("usernameBem").value = DUMMY_BEM.username;
        document.getElementById("passBem").value = DUMMY_BEM.password;
      }
    });
  }
});

/* ========================================
   FORM ASPIRASI (form-aspirasi.html)
   ======================================== */

let selectedFiles = [];

function toggleAnonim() {
  const isAnonim = document.getElementById("modeAnonim").checked;
  const section = document.getElementById("dataMahasiswaSection");
  const namaInput = document.getElementById("namaLengkap");
  const nimInput = document.getElementById("nimForm");

  if (isAnonim) {
    section.style.display = "none";
    namaInput.required = false;
    nimInput.required = false;
  } else {
    section.style.display = "block";
    namaInput.required = true;
    nimInput.required = true;
  }
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files);

  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      showToast(`File "${file.name}" terlalu besar (maks. 5MB)`, "error");
      return;
    }
    selectedFiles.push(file.name);
  });

  renderFilePreview();
}

function renderFilePreview() {
  const preview = document.getElementById("uploadPreview");
  preview.innerHTML = "";
  selectedFiles.forEach((fileName, index) => {
    const item = document.createElement("div");
    item.className = "upload-preview-item";
    item.innerHTML = `📄 ${fileName} <span class="remove-file" onclick="removeFile(${index})">✕</span>`;
    preview.appendChild(item);
  });
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderFilePreview();
}

function handleSubmitAspirasi(event) {
  event.preventDefault();

  const isAnonim = document.getElementById("modeAnonim").checked;
  const judul = document.getElementById("judul").value.trim();
  const isi = document.getElementById("isiAspirasi").value.trim();
  const kategoriEl = document.querySelector('input[name="kategori"]:checked');
  const jenisEl = document.querySelector('input[name="jenis"]:checked');
  const warningBox = document.getElementById("badWordWarning");

  if (!kategoriEl) {
    showToast("Pilih kategori laporan terlebih dahulu", "error");
    return;
  }

  if (containsBadWord(judul) || containsBadWord(isi)) {
    warningBox.classList.add("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  warningBox.classList.remove("show");

  const urlParams = new URLSearchParams(window.location.search);
  const isEdit = urlParams.get('edit') === 'true';
  const reports = getReports();
  const session = getSession();
  const now = new Date();
  let ticket;

  if (isEdit) {
    ticket = sessionStorage.getItem("edit_ticket_id");
    const rIndex = reports.findIndex(rep => rep.ticket === ticket);
    if (rIndex !== -1) {
      reports[rIndex].judul = judul;
      reports[rIndex].isi = isi;
      reports[rIndex].anonim = isAnonim;
      reports[rIndex].nama = isAnonim ? "Anonim" : document.getElementById("namaLengkap").value.trim();
      reports[rIndex].nim = isAnonim ? "" : document.getElementById("nimForm").value.trim();
      reports[rIndex].kategori = kategoriEl.value;
      reports[rIndex].jenis = jenisEl.value;

      saveReports(reports);
      sessionStorage.removeItem("edit_ticket_id");
      showToast("Perubahan berhasil disimpan", "success");
      setTimeout(() => {
        window.location.href = "dashboard-mahasiswa.html";
      }, 1000);
      return;
    }
  }

  ticket = generateTicketId();
  const newReport = {
    ticket: ticket,
    nama: isAnonim ? "Anonim" : document.getElementById("namaLengkap").value.trim(),
    nim: isAnonim ? "" : document.getElementById("nimForm").value.trim(),
    _ownerNim: session ? session.nim : "",
    anonim: isAnonim,
    kategori: kategoriEl.value,
    jenis: jenisEl.value,
    judul: judul,
    isi: isi,
    files: selectedFiles.slice(),
    status: "pending",
    flagged: false,
    tanggal: now.toISOString(),
    timeline: [
      { label: "Laporan Dikirim", desc: "Aspirasi berhasil masuk ke sistem SUARAKU", time: formatTanggal(now.toISOString()), done: true },
      { label: "Lolos Pengecekan Sistem", desc: "Tidak ditemukan kata kasar atau konten tidak pantas", time: formatTanggal(now.toISOString()), done: true, active: true },
      { label: "Direview oleh BEM", desc: "Menunggu peninjauan dari BEM", time: "Belum diproses", done: false },
      { label: "Ditinjau Kemahasiswaan", desc: "Menunggu hasil review BEM", time: "Belum diproses", done: false },
      { label: "Tindak Lanjut Selesai", desc: "Menunggu keputusan akhir dari Ketua STMIK Kharisma", time: "Belum diproses", done: false }
    ]
  };

  const undoModal = document.getElementById("undoSubmitModal");
  const progressBar = document.getElementById("undoProgressBar");
  const undoBtn = document.getElementById("undoSubmitBtn");

  undoModal.classList.add("show");
  progressBar.style.width = "100%";

  setTimeout(() => {
    progressBar.style.width = "0%";
  }, 10);

  let isCancelled = false;

  const submitTimeout = setTimeout(() => {
    if (!isCancelled) {
      reports.push(newReport);
      saveReports(reports);
      undoModal.classList.remove("show");

      document.getElementById("modalTicketCode").textContent = ticket;
      document.getElementById("successModal").classList.add("show");
    }
  }, 10000);

  undoBtn.onclick = () => {
    isCancelled = true;
    clearTimeout(submitTimeout);
    undoModal.classList.remove("show");
    showToast("Pengiriman aspirasi dibatalkan", "info");
  };
}

function closeSuccessModal() {
  document.getElementById("successModal").classList.remove("show");
  document.getElementById("formAspirasi").reset();
  selectedFiles = [];
  renderFilePreview();
  document.getElementById("dataMahasiswaSection").style.display = "block";
}

/* ========================================
   TRACKING PAGE (tracking.html)
   ======================================== */

function handleTrackTicket() {
  const input = document.getElementById("ticketInput").value.trim().toUpperCase();
  const notFound = document.getElementById("ticketNotFound");
  const result = document.getElementById("trackingResult");
  const emptyState = document.getElementById("trackingEmptyState");
  const backBtn = document.getElementById("btnBackToDash");

  if (!input) {
    showToast("Masukkan kode tiket terlebih dahulu", "error");
    return;
  }

  const reports = getReports();
  const found = reports.find(r => r.ticket.toUpperCase() === input);

  if (!found) {
    notFound.classList.add("show");
    result.style.display = "none";
    emptyState.style.display = "block";
    if (backBtn) backBtn.style.display = "none";
    return;
  }

  notFound.classList.remove("show");
  emptyState.style.display = "none";
  result.style.display = "block";
  if (backBtn && getSession()) backBtn.style.display = "inline-flex";

  document.getElementById("resultTitle").textContent = found.judul;
  document.getElementById("resultBadge").className = "badge " + badgeClassForStatus(found.status);
  document.getElementById("resultBadge").textContent = labelForStatus(found.status);
  document.getElementById("resultTicket").textContent = found.ticket;
  document.getElementById("resultKategori").textContent = found.kategori;
  document.getElementById("resultJenis").textContent = found.jenis;
  document.getElementById("resultTanggal").textContent = formatTanggal(found.tanggal);
  document.getElementById("resultPengirim").textContent = found.anonim ? "Anonim" : found.nama;

  const timelineEl = document.getElementById("resultTimeline");
  timelineEl.innerHTML = "";
  found.timeline.forEach(step => {
    const div = document.createElement("div");
    let cls = "timeline-step";
    if (step.done) cls += " completed";
    else if (step.active) cls += " active";
    div.className = cls;
    div.innerHTML = `
      <h4>${step.label}</h4>
      <p>${step.desc}</p>
      <span class="timeline-time">${step.time}</span>
    `;
    timelineEl.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const ticketInput = document.getElementById("ticketInput");
  if (ticketInput) {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get("ticket");
    if (t) {
      ticketInput.value = t;
      handleTrackTicket();
    }
  }

  const navActions = document.getElementById("trackingNavActions");
  const session = getSession();
  if (navActions && session) {
    navActions.innerHTML = `<a href="dashboard-mahasiswa.html" class="btn btn-outline" style="padding:10px 20px;">Dashboard</a>`;
  }
});

/* ========================================
   DASHBOARD MAHASISWA (dashboard-mahasiswa.html)
   ======================================== */

function renderPublicReports() {
  const listEl = document.getElementById("publicReportsList");
  if (!listEl) return;

  const session = getSession();
  const reports = getReports();

  const publicReports = reports.filter(r => {
    if (session && session.role === "mahasiswa") {
      const isMine = (r._ownerNim && r._ownerNim === session.nim) || (!r.anonim && !r._ownerNim && r.nim === session.nim);
      return !isMine;
    }
    return !r.anonim;
  });

  listEl.innerHTML = "";

  if (publicReports.length === 0) {
    document.getElementById("publicReportsEmpty").style.display = "block";
    return;
  }
  document.getElementById("publicReportsEmpty").style.display = "none";

  publicReports.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  publicReports.forEach(r => {
    const div = document.createElement("div");
    div.className = "report-item";
    const pengirim = r.anonim ? "Anonim" : `${r.nama} (${r.nim})`;
    div.innerHTML = `
      <div class="report-icon">${iconForKategori(r.kategori)}</div>
      <div class="report-body">
        <div class="report-top">
          <h4>${r.judul}</h4>
          <span class="badge ${badgeClassForStatus(r.status)}">${labelForStatus(r.status)}</span>
        </div>
        <p class="report-desc">Oleh: <strong>${pengirim}</strong> · ${r.kategori} · ${formatTanggal(r.tanggal)}</p>
        <p class="report-text-preview">${r.isi.substring(0, 100)}${r.isi.length > 100 ? '...' : ''}</p>
      </div>
    `;
    listEl.appendChild(div);
  });
}

function renderMyReports(filter = "semua") {
  const listEl = document.getElementById("myReportsList");
  if (!listEl) return;

  const session = getSession();
  const reports = getReports();

  let myReports = [];
  if (session && session.role === "mahasiswa") {
    myReports = reports.filter(r => {
      if (r._ownerNim && r._ownerNim === session.nim) return true;
      if (!r.anonim && r.nim === session.nim) return true;
      return false;
    });
  }

  if (filter !== "semua") {
    myReports = myReports.filter(r => r.status === filter);
  }

  listEl.innerHTML = "";

  if (myReports.length === 0) {
    document.getElementById("myReportsEmpty").style.display = "block";
    return;
  }
  document.getElementById("myReportsEmpty").style.display = "none";

  myReports.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  myReports.forEach(r => {
    const div = document.createElement("div");
    div.className = "report-item";
    const isPending = r.status === "pending";
    const actionButtons = isPending ? `
        <button class="btn btn-sm btn-outline" onclick="handleEditAspirasi('${r.ticket}')">Edit</button>
        <button class="btn btn-sm btn-reject" onclick="handleDeleteAspirasi('${r.ticket}')">Hapus</button>
    ` : "";

    div.innerHTML = `
      <div class="report-icon">${iconForKategori(r.kategori)}</div>
      <div class="report-body">
        <div class="report-top">
          <h4>${r.judul}</h4>
          <span class="badge ${badgeClassForStatus(r.status)}">${labelForStatus(r.status)}</span>
        </div>
        <p class="report-desc">${r.kategori} · ${r.ticket} · Dikirim ${formatTanggal(r.tanggal)}</p>
        <div class="report-meta">
          <span>Kategori: ${r.kategori}</span>
          <span>Jenis: ${r.jenis}</span>
        </div>
      </div>
      <div class="report-actions">
        <a href="tracking.html?ticket=${r.ticket}" class="btn btn-sm btn-view">Lacak</a>
        ${actionButtons}
      </div>
    `;
    listEl.appendChild(div);
  });

  setStatIfExists("myStatTotal", myReports.length);
  setStatIfExists("myStatPending", myReports.filter(r => r.status === "pending").length);
  setStatIfExists("myStatProcess", myReports.filter(r => r.status === "diproses").length);
  setStatIfExists("myStatDone", myReports.filter(r => r.status === "selesai").length);
}

function setStatIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function iconForKategori(kategori) {
  switch (kategori) {
    case "Akademik": return "📘";
    case "Fasilitas": return "🏫";
    case "Layanan Kampus": return "🛎️";
    default: return "📝";
  }
}

function filterMyReports(filter, btnEl) {
  document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.remove("active"));
  btnEl.classList.add("active");
  renderMyReports(filter);
}

/* ========================================
   DASHBOARD BEM (dashboard-bem.html)
   ======================================== */

function renderBemReports(filter = "semua") {
  const listEl = document.getElementById("bemReportsList");
  if (!listEl) return;

  let reports = getReports().filter(r => r.status === "pending");

  if (filter === "flagged") {
    reports = reports.filter(r => r.flagged);
  } else if (filter === "akademik" || filter === "fasilitas") {
    const label = filter === "akademik" ? "Akademik" : "Fasilitas";
    reports = reports.filter(r => r.kategori === label);
  }

  listEl.innerHTML = "";

  if (reports.length === 0) {
    document.getElementById("bemReportsEmpty").style.display = "block";
    return;
  }
  document.getElementById("bemReportsEmpty").style.display = "none";

  reports.sort((a, b) => {
    if (a.flagged !== b.flagged) return a.flagged ? -1 : 1;
    return new Date(b.tanggal) - new Date(a.tanggal);
  });

  reports.forEach(r => {
    const div = document.createElement("div");
    div.className = "report-item";
    const iconStyle = r.flagged ? 'style="background:#FEE2E2; color:var(--status-reject);"' : "";
    const icon = r.flagged ? "🚩" : iconForKategori(r.kategori);
    const pengirim = r.anonim ? "Anonim" : `${r.nama} (${r.nim})`;
    const flagNote = r.flagged ? " · Terdeteksi kata kurang pantas, perlu ditinjau manual." : " · Lolos pengecekan otomatis.";

    div.innerHTML = `
      <div class="report-icon" ${iconStyle}>${icon}</div>
      <div class="report-body">
        <div class="report-top">
          <h4>${r.judul}</h4>
          <span class="report-id">${r.ticket}</span>
        </div>
        <p class="report-desc">${r.kategori} · ${pengirim}${flagNote}</p>
        <div class="report-meta">
          <span>Dikirim: ${formatTanggal(r.tanggal)}</span>
          <span>Jenis: ${r.jenis}</span>
        </div>
      </div>
      <div class="report-actions">
        <button class="btn btn-sm btn-view" onclick="openReviewModal('${r.ticket}')">Lihat</button>
        <button class="btn btn-sm btn-approve" onclick="handleApprove('${r.ticket}')">Setujui</button>
        <button class="btn btn-sm btn-reject" onclick="handleReject('${r.ticket}')">Tolak</button>
      </div>
    `;
    listEl.appendChild(div);
  });

  updateBemStats();
}

function updateBemStats() {
  const reports = getReports();
  setStatIfExists("bemStatMasuk", reports.filter(r => r.status === "pending").length);
  setStatIfExists("bemStatFlagged", reports.filter(r => r.flagged && r.status === "pending").length);
  setStatIfExists("bemStatForwarded", reports.filter(r => r.status === "diproses").length);
  setStatIfExists("bemStatDone", reports.filter(r => r.status === "selesai").length);
}

function filterBemReports(filter, btnEl) {
  document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.remove("active"));
  btnEl.classList.add("active");
  renderBemReports(filter);
}

function openReviewModal(ticketId) {
  const reports = getReports();
  const r = reports.find(rep => rep.ticket === ticketId);
  if (!r) return;

  document.getElementById("reviewTicket").textContent = r.ticket;
  document.getElementById("reviewPengirim").textContent = r.anonim ? "Anonim" : `${r.nama} (${r.nim})`;
  document.getElementById("reviewKategori").textContent = r.kategori;
  document.getElementById("reviewJenis").textContent = r.jenis;
  document.getElementById("reviewTanggal").textContent = formatTanggal(r.tanggal);
  document.getElementById("reviewIsi").textContent = r.isi;

  document.getElementById("reviewModal").classList.add("show");
}

function closeReviewModal() {
  document.getElementById("reviewModal").classList.remove("show");
}

function handleApprove(ticketId) {
  const reports = getReports();
  const r = reports.find(rep => rep.ticket === ticketId);
  if (!r) return;

  r.status = "diproses";
  r.timeline[2].done = true;
  r.timeline[2].active = false;
  r.timeline[2].time = formatTanggal(new Date().toISOString());
  r.timeline[3].active = true;

  saveReports(reports);
  closeReviewModal();
  showToast(`Laporan ${ticketId} disetujui dan diteruskan ke Kemahasiswaan`, "success");
  renderBemReports();
}

function handleReject(ticketId) {
  const reports = getReports();
  const r = reports.find(rep => rep.ticket === ticketId);
  if (!r) return;

  r.status = "ditolak";

  saveReports(reports);
  closeReviewModal();
  showToast(`Laporan ${ticketId} ditolak`, "error");
  renderBemReports();
}

/* ========================================
   LANDING PAGE (index.html) — statistik dinamis
   ======================================== */

function renderLandingStats() {
  const statTotal = document.getElementById("statTotal");
  if (!statTotal) return;

  const reports = getReports();
  const total = reports.length;
  const selesai = reports.filter(r => r.status === "selesai").length;
  const diproses = reports.filter(r => r.status === "diproses").length;

  setStatIfExists("statTotal", total);
  setStatIfExists("statSelesai", selesai);
  setStatIfExists("stat1", total);
  setStatIfExists("stat2", diproses);
  setStatIfExists("stat3", selesai);
}

/* ========================================
   FITUR TAMBAHAN: EDIT, DELETE, EXPIRED, REMINDER
   ======================================== */

function showConfirmModal(title, desc, onConfirm) {
  const modal = document.getElementById("confirmModal");
  if (!modal) return;

  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmDesc").textContent = desc;

  const btn = document.getElementById("confirmBtn");
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.onclick = () => {
    onConfirm();
    closeConfirmModal();
  };

  modal.classList.add("show");
}

function closeConfirmModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.classList.remove("show");
}

function handleDeleteAspirasi(ticketId) {
  showConfirmModal(
    "Hapus Aspirasi?",
    `Apakah Anda yakin ingin menghapus aspirasi ${ticketId}? Tindakan ini tidak bisa dibatalkan.`,
    () => {
      const reports = getReports();
      const index = reports.findIndex(r => r.ticket === ticketId);
      if (index === -1) return;

      reports.splice(index, 1);
      saveReports(reports);

      showToast(`Aspirasi ${ticketId} berhasil dihapus`, "success");
      renderMyReports();
    }
  );
}

function undoDelete(ticketId) {
  if (!window._lastDeleted) return;
  const reports = getReports();
  reports.push(window._lastDeleted);
  saveReports(reports);
  window._lastDeleted = null;
  showToast("Penghapusan dibatalkan", "success");
  renderMyReports();
}

function handleEditAspirasi(ticketId) {
  const reports = getReports();
  const r = reports.find(rep => rep.ticket === ticketId);
  if (!r) return;

  if (r.status !== "pending") {
    showToast("Hanya aspirasi dengan status 'Menunggu' yang bisa diedit", "error");
    return;
  }

  sessionStorage.setItem("edit_ticket_id", ticketId);
  window.location.href = "form-aspirasi.html?edit=true";
}

function handleCheckStatus(ticketId) {
  showToast(`Mengecek status terbaru untuk ${ticketId}...`, "success");
  setTimeout(() => {
    showToast("Belum ada update terbaru dari pihak kampus.", "info");
  }, 1000);
}

function processSystemAutomations() {
  const reports = getReports();
  const now = new Date();
  let changed = false;

  reports.forEach(r => {
    const createdDate = new Date(r.tanggal);
    const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

    if (r.status === "pending" && diffDays > 14) {
      r.status = "expired";
      changed = true;
    }

    if (r.status === "pending" && diffDays > 3 && !r._reminderSent) {
      console.log(`REMINDER BEM: Ada laporan ${r.ticket} menunggu review > 3 hari`);
      r._reminderSent = true;
      changed = true;
    }

    if (r.status === "diproses" && diffDays > 7 && !r._escalated) {
      console.log(`ESCALATE: Laporan ${r.ticket} sudah diproses > 7 hari, eskalasi ke Ketua BEM`);
      r._escalated = true;
      changed = true;
    }
  });

  if (changed) {
    saveReports(reports);
  }
}

/* ========================================
   INIT — dipanggil saat halaman dimuat
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  processSystemAutomations();

  renderLandingStats();

  if (document.getElementById("myReportsList")) {
    renderMyReports();
    renderPublicReports();

    const reports = getReports();
    const session = getSession();
    const nim = session ? session.nim : "";
    const myReports = reports.filter(r => (r._ownerNim === nim) || (!r.anonim && !r._ownerNim && r.nim === nim));
    if (myReports.some(r => r.status === "pending" || r.status === "diproses")) {
      const panelHeader = document.querySelector(".panel-header");
      if (panelHeader) {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline";
        btn.style.marginLeft = "auto";
        btn.textContent = "Belum ada update? Cek di sini";
        btn.onclick = () => handleCheckStatus('Semua');
        panelHeader.appendChild(btn);
      }
    }
  }

  if (document.getElementById("bemReportsList")) {
    renderBemReports();
    updateBemStats();
  }

  if (window.location.pathname.includes("form-aspirasi.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true') {
      const editTicketId = sessionStorage.getItem("edit_ticket_id");
      if (editTicketId) {
        const reports = getReports();
        const r = reports.find(rep => rep.ticket === editTicketId);
        if (r) {
          document.getElementById("judul").value = r.judul;
          document.getElementById("isiAspirasi").value = r.isi;
          document.getElementById("modeAnonim").checked = r.anonim;
          toggleAnonim();
          if (!r.anonim) {
            document.getElementById("namaLengkap").value = r.nama;
            document.getElementById("nimForm").value = r.nim;
          }
          const catInput = document.querySelector(`input[name="kategori"][value="${r.kategori}"]`);
          if (catInput) catInput.checked = true;
          const typeInput = document.querySelector(`input[name="jenis"][value="${r.jenis}"]`);
          if (typeInput) typeInput.checked = true;

          document.querySelector(".form-header h1").textContent = "Edit Aspirasi";
          document.querySelector(".btn-submit-aspirasi").textContent = "Simpan Perubahan";
        }
      }
    }
  }

  getReports();
});