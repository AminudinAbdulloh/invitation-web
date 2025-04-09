document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:4000/api/rsvp";
    const tableBody = document.getElementById("rsvp-data");
    const downloadBtn = document.getElementById("download-rsvp");

    // Fungsi untuk mengambil data dari API dan render ke tabel
    async function fetchRSVPData() {
        try {
            const response = await fetch(apiUrl);
            const result = await response.json();
            const data = result.data;

            // Bersihkan isi tabel sebelum isi ulang
            tableBody.innerHTML = "";

            if (!data || data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center px-6 py-4">Tidak ada data RSVP</td>
                    </tr>`;
                return;
            }

            // Isi tabel dengan data dari API
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="text-center px-6 py-4">${item.nama}</td>
                    <td class="text-center px-6 py-4">${item.kehadiran}</td>
                    <td class="text-center px-6 py-4">${item.jumlah_tamu}</td>
                    <td class="text-center px-6 py-4">${item.ucapan ?? "-"}</td>
                `;
                tableBody.appendChild(row);
            });

            return data; // untuk digunakan pada tombol download
        } catch (error) {
            console.error("Gagal mengambil data RSVP:", error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center px-6 py-4 text-red-500">Gagal memuat data</td>
                </tr>`;
        }
    }

    // Fungsi untuk download data sebagai file Excel
    async function downloadExcel() {
        const data = await fetchRSVPData(); // Pastikan data terupdate
        if (!data || data.length === 0) return;

        // Format data untuk SheetJS
        const worksheetData = data.map(item => ({
            Nama: item.nama,
            Kehadiran: item.kehadiran,
            "Jumlah Tamu": item.jumlah_tamu,
            Ucapan: item.ucapan || "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "RSVP");

        // Simpan file dengan nama sesuai
        XLSX.writeFile(workbook, "RSVP_Tiara_Jalu.xlsx");
    }

    // Load data ke tabel saat halaman dimuat
    fetchRSVPData();

    // Event listener tombol download
    downloadBtn.addEventListener("click", downloadExcel);
});
