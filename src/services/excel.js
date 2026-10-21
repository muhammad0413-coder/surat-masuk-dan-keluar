import * as XLSX from 'xlsx';

/**
 * Exports letter records to Excel (.xlsx) with attachment links
 * @param {Array} letters - Array of letter objects
 * @param {string} fileNamePrefix - Prefix for the exported file name
 * @param {string} title - Optional title inside the sheet
 */
export function exportLettersToExcel(letters = [], fileNamePrefix = 'Buku_Agenda_Surat_SDN_Kesilir_02', title = 'BUKU AGENDA SURAT MASUK DAN SURAT KELUAR') {
  if (!letters || letters.length === 0) {
    alert('Tidak ada data surat untuk diekspor ke Excel.');
    return;
  }

  // Define headers
  const headers = [
    'No.',
    'Jenis Surat',
    'No. Agenda',
    'Tanggal Surat',
    'Tanggal Diterima',
    'Nomor Surat',
    'Alamat Surat (Pengirim / Tujuan)',
    'Perihal',
    'Isi / Ringkasan Surat',
    'Keterangan',
    'Jumlah Bukti',
    'Nama Berkas Bukti',
    'Tautan Bukti Surat (Link Download)'
  ];

  // Map rows
  const rows = letters.map((l, index) => {
    const isMasuk = l.jenisSurat === 'masuk';
    const noSurat = isMasuk ? (l.nomorSuratMasuk || '-') : (l.nomorSuratKeluar || '-');
    
    // Process attachments
    const lampiranList = Array.isArray(l.lampiran) ? l.lampiran : [];
    const namaBerkas = lampiranList.map(f => f.name || 'Berkas').join(', ');
    const urls = lampiranList.map(f => f.url).filter(Boolean);
    const linkBukti = urls.length > 0 ? urls.join(' ; ') : '-';

    return [
      index + 1,
      isMasuk ? 'SURAT MASUK' : 'SURAT KELUAR',
      l.nomorAgenda || '-',
      l.tanggalSurat || '-',
      isMasuk ? (l.tanggalDiterima || l.tanggalSurat || '-') : '-',
      noSurat,
      l.alamatSurat || '-',
      l.perihal || '-',
      l.isiSurat || '-',
      l.keterangan || '-',
      lampiranList.length,
      namaBerkas || '-',
      linkBukti
    ];
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Construct sheet data with title and empty row
  const sheetData = [
    [title],
    [`SD NEGERI KESILIR 02 - KECAMATAN WULUHAN, KABUPATEN JEMBER`],
    [`Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
    [], // Blank row
    headers,
    ...rows
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Auto-fit column widths
  const colWidths = [
    { wch: 6 },   // No
    { wch: 16 },  // Jenis Surat
    { wch: 12 },  // No Agenda
    { wch: 14 },  // Tanggal Surat
    { wch: 16 },  // Tanggal Diterima
    { wch: 25 },  // Nomor Surat
    { wch: 32 },  // Alamat Surat
    { wch: 36 },  // Perihal
    { wch: 40 },  // Isi Surat
    { wch: 20 },  // Keterangan
    { wch: 14 },  // Jumlah Bukti
    { wch: 30 },  // Nama Berkas
    { wch: 55 }   // Tautan Bukti
  ];
  ws['!cols'] = colWidths;

  // Make attachment URLs clickable hyperlinks in Excel
  const headerRowIndex = 4; // 0-indexed row 4 is headers
  rows.forEach((row, rIdx) => {
    const l = letters[rIdx];
    const lampiranList = Array.isArray(l.lampiran) ? l.lampiran : [];
    if (lampiranList.length > 0 && lampiranList[0].url) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex + 1 + rIdx, c: 12 });
      if (ws[cellRef]) {
        ws[cellRef].l = { Target: lampiranList[0].url, Tooltip: `Buka Bukti Surat (${lampiranList[0].name})` };
      }
    }
  });

  // Append sheet and write
  XLSX.utils.book_append_sheet(wb, ws, 'Agenda Surat');

  const timestamp = new Date().toISOString().split('T')[0];
  const fullFileName = `${fileNamePrefix}_${timestamp}.xlsx`;
  
  XLSX.writeFile(wb, fullFileName);
}
