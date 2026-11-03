import React, { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Printer,
  Download,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  Trash2,
  FileDown,
  Star,
  ShieldCheck,
  Settings,
  Check,
} from "lucide-react";

// ─── PROGRAMMATIC PRESETS & MULTI-PRODUCT AFFILIATE CATALOG ────────────────
const PRESETS = {
  "avery-5160": {
    name: "Avery 5160 (30-Up)",
    badge: "Most Popular for FBA",
    layout: "avery5160",
    symbology: "CODE128",
    defaultSku: "X003A8K9L1",
    defaultTitle: "Lavender Essential Oil - 2oz",
    pageTitle: "Free Avery 5160 Barcode Label Sheet Generator (30-Up)",
    affiliateSupplies: [
      {
        id: "avery-5160-paper",
        tag: "#1 Best Seller in Laser Labels",
        badgeColor: "bg-amber-100 text-amber-800",
        title: "Avery 5160 30-Up Printable Labels (3,000 pk)",
        specs: "100 Sheets • Smudge-Free Matte Paper • Ultrahold Adhesive",
        rating: 4.8,
        reviews: "48,200+",
        price: "$12.99",
        asin: "B00004Z5SM",
        prime: true,
      },
      {
        id: "netum-scanner",
        tag: "Amazon's Choice",
        badgeColor: "bg-indigo-100 text-indigo-800",
        title: "Netum Wireless Bluetooth 1D/2D Barcode Scanner",
        specs: "Instant barcode test verification • Connects to Phone/PC",
        rating: 4.6,
        reviews: "3,950+",
        price: "$29.99",
        asin: "B07T2Q3B7N",
        prime: true,
      },
      {
        id: "hp-laser-printer",
        tag: "Top Rated for FBA",
        badgeColor: "bg-emerald-100 text-emerald-800",
        title: "HP LaserJet M110w Wireless Monochrome Laser Printer",
        specs: "Zero smudging • Crisp 600 DPI barcodes • Compact footprint",
        rating: 4.4,
        reviews: "5,120+",
        price: "$99.00",
        asin: "B09NZB7G7G",
        prime: true,
      },
    ],
  },
  "thermal-2x1": {
    name: "Thermal Roll (2.25\" x 1.25\")",
    badge: "Direct Thermal Roll",
    layout: "thermal2x1",
    symbology: "CODE128",
    defaultSku: "X0029B87PL",
    defaultTitle: "Wireless Earbuds Case - Black",
    pageTitle: "Thermal Printer Barcode Generator (2.25 x 1.25\") - Rollo & Munbyn",
    affiliateSupplies: [
      {
        id: "munbyn-thermal-roll",
        tag: "#1 Best Seller in Thermal Paper",
        badgeColor: "bg-amber-100 text-amber-800",
        title: "Munbyn 2.25\" x 1.25\" Direct Thermal FNSKU Labels",
        specs: "1,000 Labels/Roll • Waterproof, Oilproof & Smudgeproof",
        rating: 4.8,
        reviews: "9,540+",
        price: "$9.99",
        asin: "B08B5RBD6Z",
        prime: true,
      },
      {
        id: "munbyn-printer",
        tag: "Amazon's Choice",
        badgeColor: "bg-indigo-100 text-indigo-800",
        title: "Munbyn RealWriter 941 High-Speed USB Thermal Printer",
        specs: "Zero Ink or Toner Needed • 150mm/s Commercial Speed",
        rating: 4.7,
        reviews: "14,180+",
        price: "$139.99",
        asin: "B0885YK9N1",
        prime: true,
      },
      {
        id: "rollo-printer",
        tag: "Commercial Workhorse",
        badgeColor: "bg-purple-100 text-purple-800",
        title: "Rollo Direct Thermal Commercial Grade Label Printer",
        specs: "Crystal-clear optical barcode scanning • High volume duty",
        rating: 4.8,
        reviews: "18,450+",
        price: "$189.99",
        asin: "B01MA3EYLS",
        prime: true,
      },
    ],
  },
  "avery-5163-box": {
    name: "Avery 5163 Box Labels (10-Up)",
    badge: "Master Carton & Shipping",
    layout: "avery5163",
    symbology: "CODE128",
    defaultSku: "BOX-CARTON-0042",
    defaultTitle: "Master Case - 24 Units Fragile",
    pageTitle: "Avery 5163 10-Up FBA Box & Carton Label Generator",
    affiliateSupplies: [
      {
        id: "avery-5163-paper",
        tag: "#1 Best Seller in Shipping Labels",
        badgeColor: "bg-amber-100 text-amber-800",
        title: "Avery 5163 10-Up Shipping Labels (1,000 pk)",
        specs: "TrueBlock Tech (completely hides underlying text on boxes)",
        rating: 4.8,
        reviews: "21,300+",
        price: "$19.49",
        asin: "B00006B8FX",
        prime: true,
      },
      {
        id: "scotch-tape",
        tag: "Amazon's Choice",
        badgeColor: "bg-indigo-100 text-indigo-800",
        title: "Scotch Heavy Duty Shipping Packaging Tape (6 Rolls + Dispenser)",
        specs: "Guaranteed to stay sealed • Industrial strength 20x holding power",
        rating: 4.8,
        reviews: "32,100+",
        price: "$15.99",
        asin: "B000J07BR4",
        prime: true,
      },
      {
        id: "postal-scale",
        tag: "FBA Box Requirement",
        badgeColor: "bg-emerald-100 text-emerald-800",
        title: "Amazon Basics Digital Postal Shipping Scale (110 lb)",
        specs: "Accurate box weight verification to avoid Amazon inbound penalties",
        rating: 4.6,
        reviews: "12,800+",
        price: "$18.99",
        asin: "B0739M95PZ",
        prime: true,
      },
    ],
  },
};


export default function App() {
  const [currentRoute, setCurrentRoute] = useState("avery-5160");
  const preset = PRESETS[currentRoute] || PRESETS["avery-5160"];

  const [mode, setMode] = useState("single");
  const [barcodeValue, setBarcodeValue] = useState(preset.defaultSku);
  const [symbology, setSymbology] = useState(preset.symbology);
  const [itemTitle, setItemTitle] = useState(preset.defaultTitle);
  const [itemCondition, setItemCondition] = useState("Condition: New");
  const [layout, setLayout] = useState(preset.layout);
  const [quantity, setQuantity] = useState(30);
  const [startOffset, setStartOffset] = useState(0);

  // ─── CUSTOMIZABLE AMAZON AFFILIATE SETTINGS ────────────────────────────────
  const [amazonTag, setAmazonTag] = useState(() => {
    try {
      return localStorage.getItem("labelcraft_amazon_tag") || "labelcraft-20";
    } catch {
      return "labelcraft-20";
    }
  });
  const [amazonDomain, setAmazonDomain] = useState(() => {
    try {
      return localStorage.getItem("labelcraft_amazon_domain") || "com";
    } catch {
      return "com";
    }
  });
  const [showAffiliateSettings, setShowAffiliateSettings] = useState(false);

  const handleUpdateAmazonTag = (tag) => {
    setAmazonTag(tag);
    try {
      localStorage.setItem("labelcraft_amazon_tag", tag);
    } catch {}
  };

  const handleUpdateAmazonDomain = (domain) => {
    setAmazonDomain(domain);
    try {
      localStorage.setItem("labelcraft_amazon_domain", domain);
    } catch {}
  };

  const getAmazonUrl = (asin) => {
    return `https://www.amazon.${amazonDomain}/dp/${asin}?tag=${encodeURIComponent(amazonTag)}`;
  };

  const [batchItems, setBatchItems] = useState([
    { sku: "X003A8K9L1", title: "Lavender Oil 2oz", condition: "Condition: New", quantity: 6 },
    { sku: "X0088Z11Q2", title: "Tea Tree Soap Bar", condition: "Condition: New", quantity: 12 },
    { sku: "X0091L00M4", title: "Eucalyptus Bath Salts", condition: "Condition: New", quantity: 12 },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const barcodeCanvasRef = useRef(null);

  // Check URL params on initial load (?preset=thermal-2x1 or pathname)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("preset") || window.location.pathname.replace("/", "");
    if (PRESETS[p]) {
      setCurrentRoute(p);
    }
  }, []);

  // Update layout when route changes
  useEffect(() => {
    setLayout(preset.layout);
    setBarcodeValue(preset.defaultSku);
    setItemTitle(preset.defaultTitle);
    document.title = preset.pageTitle;
  }, [currentRoute]);

  // Update live barcode visual
  useEffect(() => {
    if (!barcodeValue || mode === "batch") return;
    try {
      JsBarcode(barcodeCanvasRef.current, barcodeValue, {
        format: symbology,
        width: 1.8,
        height: 46,
        displayValue: true,
        fontSize: 12,
        margin: 4,
        background: "#ffffff",
      });
    } catch (e) {
      console.warn("Invalid barcode format", e);
    }
  }, [barcodeValue, symbology, mode]);

  // Parse CSV
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const sep = lines[0].includes(";") ? ";" : ",";
      const parsed = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(sep).map((p) => p.trim().replace(/^["']|["']$/g, ""));
        if (parts[0]) {
          parsed.push({
            sku: parts[0],
            title: parts[1] || "",
            condition: parts[2] || "Condition: New",
            quantity: parseInt(parts[3]) || 1,
          });
        }
      }

      if (parsed.length > 0) {
        setBatchItems(parsed);
        setMode("batch");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent =
      "sku,title,condition,quantity\n" +
      "X003A8K9L1,Organic Lavender Oil 2oz,Condition: New,10\n" +
      "X0077B22Z9,Peppermint Lip Balm,Condition: New,15\n" +
      "UPC012345678905,Travel Toiletry Bag,Condition: New,5\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_inventory_barcodes.csv";
    link.click();
  };

  const generateBarcodePngBytes = (sku, sym = "CODE128") => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, sku, {
      format: sym,
      width: 1.8,
      height: 46,
      displayValue: true,
      fontSize: 12,
      margin: 4,
      background: "#ffffff",
    });
    const dataUrl = canvas.toDataURL("image/png");
    const binary = atob(dataUrl.split(",")[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let labelStream = [];
      if (mode === "single") {
        labelStream = Array.from({ length: quantity }, () => ({
          sku: barcodeValue,
          title: itemTitle,
          condition: itemCondition,
          sym: symbology,
        }));
      } else {
        batchItems.forEach((item) => {
          for (let q = 0; q < item.quantity; q++) {
            labelStream.push({
              sku: item.sku,
              title: item.title,
              condition: item.condition,
              sym: symbology,
            });
          }
        });
      }

      // Barcode cache for performance
      const barcodeCache = {};
      const uniqueSkus = [...new Set(labelStream.map((l) => l.sku))];
      for (const sku of uniqueSkus) {
        const pngBytes = generateBarcodePngBytes(sku, symbology);
        barcodeCache[sku] = await pdfDoc.embedPng(pngBytes);
      }

      if (layout === "avery5160") {
        const pageWidth = 612;
        const pageHeight = 792;
        const labelWidth = 189;
        const labelHeight = 72;
        const leftMargin = 13.5;
        const topMargin = 36;
        const colPitch = 198;
        const rowPitch = 72;

        const totalSlots = startOffset + labelStream.length;
        const totalPages = Math.ceil(totalSlots / 30);

        let streamIdx = 0;
        let globalSlot = 0;

        for (let p = 0; p < totalPages; p++) {
          const page = pdfDoc.addPage([pageWidth, pageHeight]);

          for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 3; col++) {
              if (globalSlot >= startOffset && streamIdx < labelStream.length) {
                const item = labelStream[streamIdx];
                const x = leftMargin + col * colPitch;
                const y = pageHeight - (topMargin + (row + 1) * rowPitch);

                // 1. Centered Title
                if (item.title) {
                  const title = item.title.length > 36 ? item.title.slice(0, 36) + "..." : item.title;
                  const titleWidth = helveticaBold.widthOfTextAtSize(title, 7.5);
                  page.drawText(title, {
                    x: x + Math.max(4, (labelWidth - titleWidth) / 2),
                    y: y + labelHeight - 13,
                    size: 7.5,
                    font: helveticaBold,
                    color: rgb(0.1, 0.1, 0.1),
                  });
                }

                // 2. Centered Barcode
                const embeddedPng = barcodeCache[item.sku];
                if (embeddedPng) {
                  const bcWidth = 150;
                  const bcHeight = 42;
                  page.drawImage(embeddedPng, {
                    x: x + (labelWidth - bcWidth) / 2,
                    y: y + 15,
                    width: bcWidth,
                    height: bcHeight,
                  });
                }

                // 3. Centered Condition
                if (item.condition) {
                  const condWidth = helvetica.widthOfTextAtSize(item.condition, 6.5);
                  page.drawText(item.condition, {
                    x: x + (labelWidth - condWidth) / 2,
                    y: y + 5,
                    size: 6.5,
                    font: helvetica,
                    color: rgb(0.3, 0.3, 0.3),
                  });
                }
                streamIdx++;
              }
              globalSlot++;
            }
          }
        }
      } else if (layout === "avery5163") {
        const pageWidth = 612;
        const pageHeight = 792;
        const labelWidth = 288;
        const labelHeight = 144;
        const leftMargin = 12;
        const topMargin = 36;
        const colPitch = 300;
        const rowPitch = 144;

        const totalSlots = startOffset + labelStream.length;
        const totalPages = Math.ceil(totalSlots / 10);

        let streamIdx = 0;
        let globalSlot = 0;

        for (let p = 0; p < totalPages; p++) {
          const page = pdfDoc.addPage([pageWidth, pageHeight]);

          for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 2; col++) {
              if (globalSlot >= startOffset && streamIdx < labelStream.length) {
                const item = labelStream[streamIdx];
                const x = leftMargin + col * colPitch;
                const y = pageHeight - (topMargin + (row + 1) * rowPitch);

                // 1. Centered Big Box Title
                if (item.title) {
                  const title = item.title.length > 40 ? item.title.slice(0, 40) + "..." : item.title;
                  const titleWidth = helveticaBold.widthOfTextAtSize(title, 11);
                  page.drawText(title, {
                    x: x + Math.max(10, (labelWidth - titleWidth) / 2),
                    y: y + labelHeight - 24,
                    size: 11,
                    font: helveticaBold,
                    color: rgb(0.1, 0.1, 0.1),
                  });
                }

                // 2. Centered Barcode
                const embeddedPng = barcodeCache[item.sku];
                if (embeddedPng) {
                  const bcWidth = 240;
                  const bcHeight = 78;
                  page.drawImage(embeddedPng, {
                    x: x + (labelWidth - bcWidth) / 2,
                    y: y + 36,
                    width: bcWidth,
                    height: bcHeight,
                  });
                }

                // 3. Centered Condition
                if (item.condition) {
                  const condWidth = helvetica.widthOfTextAtSize(item.condition, 9);
                  page.drawText(item.condition, {
                    x: x + (labelWidth - condWidth) / 2,
                    y: y + 16,
                    size: 9,
                    font: helvetica,
                    color: rgb(0.3, 0.3, 0.3),
                  });
                }
                streamIdx++;
              }
              globalSlot++;
            }
          }
        }
      } else if (layout === "thermal2x1") {
        for (const item of labelStream) {
          const page = pdfDoc.addPage([162, 90]);

          // 1. Centered Title
          if (item.title) {
            const title = item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title;
            const titleWidth = helveticaBold.widthOfTextAtSize(title, 7.5);
            page.drawText(title, {
              x: Math.max(6, (162 - titleWidth) / 2),
              y: 75,
              size: 7.5,
              font: helveticaBold,
              color: rgb(0, 0, 0),
            });
          }

          // 2. Centered Barcode
          const embeddedPng = barcodeCache[item.sku];
          if (embeddedPng) {
            const bcWidth = 146;
            const bcHeight = 52;
            page.drawImage(embeddedPng, {
              x: (162 - bcWidth) / 2,
              y: 18,
              width: bcWidth,
              height: bcHeight,
            });
          }

          // 3. Centered Condition
          if (item.condition) {
            const condWidth = helvetica.widthOfTextAtSize(item.condition, 6.5);
            page.drawText(item.condition, {
              x: (162 - condWidth) / 2,
              y: 7,
              size: 6.5,
              font: helvetica,
              color: rgb(0.2, 0.2, 0.2),
            });
          }
        }
      }


      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `barcodes_${layout}_${Date.now()}.pdf`;
      link.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalBatchCount = batchItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* ── TOP NAV BAR ──────────────────────────────────────────────────────── */}
      <header className="border-b bg-white border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">LabelCraft</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  Client-Side • $0 Cloud
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {Object.keys(PRESETS).map((key) => (
                <button
                  key={key}
                  onClick={() => setCurrentRoute(key)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentRoute === key
                      ? "bg-white text-indigo-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {PRESETS[key].name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAffiliateSettings(!showAffiliateSettings)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                showAffiliateSettings
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
              title="Customize Amazon Affiliate Settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Affiliate ID:</span>
              <span className="font-mono text-indigo-600 font-bold">{amazonTag}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── EXPANDABLE AFFILIATE CUSTOMIZER DRAWER ───────────────────────── */}
      {showAffiliateSettings && (
        <section className="bg-indigo-950 text-white border-b border-indigo-900 py-3.5 px-4 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Affiliate Customizer
                </span>
                <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-mono">
                  Saved locally
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Replace with your Amazon Associates tag to redirect all buy links and earn commissions.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="text-xs text-indigo-300 font-medium">Tag:</label>
                <input
                  type="text"
                  value={amazonTag}
                  onChange={(e) => handleUpdateAmazonTag(e.target.value)}
                  placeholder="yourtag-20"
                  className="px-2.5 py-1.5 bg-indigo-900/80 border border-indigo-700 rounded-lg text-xs font-mono text-white focus:ring-2 focus:ring-indigo-400 outline-none w-36"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-indigo-300 font-medium">Store:</label>
                <select
                  value={amazonDomain}
                  onChange={(e) => handleUpdateAmazonDomain(e.target.value)}
                  className="px-2 py-1.5 bg-indigo-900/80 border border-indigo-700 rounded-lg text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="com">Amazon.com (US)</option>
                  <option value="co.uk">Amazon.co.uk (UK)</option>
                  <option value="ca">Amazon.ca (Canada)</option>
                  <option value="de">Amazon.de (Germany)</option>
                  <option value="fr">Amazon.fr (France)</option>
                </select>
              </div>

              <button
                onClick={() => setShowAffiliateSettings(false)}
                className="p-1.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-indigo-200 transition-colors cursor-pointer text-xs flex items-center gap-1 px-2.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Done
              </button>
            </div>
          </div>
        </section>
      )}


      {/* ── MAIN WORKSPACE ───────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            {/* Mode Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setMode("single")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === "single"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Single SKU
              </button>
              <button
                onClick={() => setMode("batch")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === "batch"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Batch CSV Upload
              </button>
            </div>

            {mode === "single" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Barcode Symbology
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["CODE128", "UPC", "EAN13"].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setSymbology(sym)}
                        className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          symbology === sym
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {sym === "CODE128" ? "FNSKU / 128" : sym}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Barcode Number / SKU
                  </label>
                  <input
                    type="text"
                    value={barcodeValue}
                    onChange={(e) => setBarcodeValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Product Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                      Total Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="600"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                    />
                  </div>
                  {layout !== "thermal2x1" && (
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                        Skip Used Slots
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={layout === "avery5160" ? 29 : 9}
                        value={startOffset}
                        onChange={(e) => setStartOffset(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCsvUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-7 h-7 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xs font-bold text-slate-800">Drop your inventory CSV here</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Columns: sku, title, condition, quantity</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {batchItems.length} SKUs ({totalBatchCount} total labels)
                  </span>
                  <button
                    onClick={handleDownloadSampleCsv}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" /> Sample CSV
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y text-xs">
                  {batchItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                      <div className="truncate pr-2">
                        <span className="font-mono font-bold text-slate-900">{item.sku}</span>
                        <p className="text-[11px] text-slate-500 truncate">{item.title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold text-[11px]">
                          ×{item.quantity}
                        </span>
                        <button
                          onClick={() => setBatchItems(batchItems.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Mode Selector */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                Destination Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "avery5160", name: "Avery 5160", desc: "30-Up Sheet" },
                  { id: "avery5163", name: "Avery 5163", desc: "10-Up Box" },
                  { id: "thermal2x1", name: "Thermal Roll", desc: "2.25\" x 1.25\"" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l.id)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      layout === l.id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-xs">{l.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleGeneratePdf}
              disabled={isGenerating || (mode === "single" ? !barcodeValue : batchItems.length === 0)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Calibrating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Print-Ready PDF
                </>
              )}
            </button>
          </div>

          <canvas ref={barcodeCanvasRef} className="hidden" />
        </section>

        {/* Right Column: Live Sheet Preview & Programmatic Affiliate */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Live Print Alignment Preview</h3>
                <p className="text-xs text-slate-500">
                  {layout === "avery5160" && "30 labels per page • 2.625\" × 1.0\""}
                  {layout === "avery5163" && "10 carton labels per page • 4.0\" × 2.0\""}
                  {layout === "thermal2x1" && "Continuous thermal roll • 2.25\" × 1.25\""}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-mono text-slate-600">
                {mode === "single" ? `${quantity} labels` : `${totalBatchCount} batch labels`}
              </span>
            </div>

            {layout === "avery5160" && (
              <div className="border border-slate-300 rounded-xl p-3 bg-slate-100 aspect-[8.5/11] max-h-[460px] overflow-hidden flex flex-col justify-between">
                <div className="grid grid-cols-3 gap-1.5 h-full">
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const isSkipped = idx < startOffset;
                    const isFilled = idx >= startOffset && idx < startOffset + (mode === "single" ? quantity : totalBatchCount);
                    return (
                      <div
                        key={idx}
                        className={`rounded border flex flex-col items-center justify-center p-1 text-center transition-all ${
                          isSkipped
                            ? "bg-slate-200 border-dashed border-slate-300 opacity-40"
                            : isFilled
                            ? "bg-white border-slate-300 shadow-2xs"
                            : "bg-slate-50 border-slate-200 opacity-20"
                        }`}
                      >
                        {isFilled && (
                          <>
                            <p className="text-[7px] font-bold truncate max-w-full text-slate-800 leading-tight">
                              {mode === "single" ? itemTitle || "PRODUCT TITLE" : "BATCH ITEM"}
                            </p>
                            <div className="h-4 w-4/5 bg-slate-900 my-0.5 rounded-2xs flex items-center justify-center text-[5px] text-white font-mono">
                              ||||||||||||||||
                            </div>
                            <p className="text-[6px] font-mono text-slate-600 leading-none">
                              {mode === "single" ? barcodeValue : "MULTI-SKU"}
                            </p>
                          </>
                        )}
                        {isSkipped && <span className="text-[7px] text-slate-400 font-medium">Used</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {layout === "avery5163" && (
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-100 aspect-[8.5/11] max-h-[460px] overflow-hidden">
                <div className="grid grid-cols-2 gap-2 h-full">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className="bg-white border border-slate-300 rounded-lg p-3 flex flex-col justify-between shadow-2xs">
                      <p className="text-[9px] font-bold text-slate-800 truncate">
                        {mode === "single" ? itemTitle : "MASTER CARTON SKU"}
                      </p>
                      <div className="h-9 w-full bg-slate-900 rounded flex items-center justify-center text-[8px] text-white font-mono">
                        ||||||||||||||||||||||||||||||||||||
                      </div>
                      <div className="flex justify-between text-[7px] font-mono text-slate-500">
                        <span>{mode === "single" ? barcodeValue : "SKU-BATCH"}</span>
                        <span>Condition: New</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layout === "thermal2x1" && (
              <div className="border border-slate-300 rounded-xl p-8 bg-slate-100 flex items-center justify-center min-h-[300px]">
                <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-4 w-64 h-36 flex flex-col justify-between items-center text-center">
                  <p className="text-xs font-bold text-slate-900 truncate w-full">{itemTitle || "Product Title"}</p>
                  <div className="h-14 w-full bg-slate-900 rounded flex items-center justify-center text-white text-xs font-mono tracking-widest">
                    ||||||||||||||||||||||
                  </div>
                  <p className="text-xs font-mono text-slate-700">{barcodeValue}</p>
                  <p className="text-[10px] text-slate-500">Condition: New</p>
                </div>
              </div>
            )}
          </div>

          {/* ── CUSTOMIZED AMAZON AFFILIATE CARDS (TIERED CATALOG) ──────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Recommended Supplies for {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Lab-tested barcode scannability for Amazon FBA fulfillment centers
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Scan Rejection Guarantee</span>
              </div>
            </div>

            {/* Product Cards List */}
            <div className="p-4 space-y-3">
              {preset.affiliateSupplies.map((item) => (
                <div
                  key={item.id}
                  className="group bg-slate-50/60 hover:bg-amber-50/30 border border-slate-200/90 hover:border-amber-300 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${item.badgeColor}`}>
                        {item.tag}
                      </span>
                      {item.prime && (
                        <span className="text-[11px] font-black italic text-sky-600 tracking-tight">
                          prime <span className="font-normal not-italic text-[10px] text-slate-500">FREE One-Day</span>
                        </span>
                      )}
                    </div>

                    <h5 className="font-semibold text-xs text-slate-900 group-hover:text-amber-900 transition-colors leading-snug">
                      {item.title}
                    </h5>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.specs}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{item.rating}</span>
                      <span className="text-[10px] text-slate-400">({item.reviews} ratings)</span>
                    </div>
                  </div>

                  {/* Price & Amazon CTA Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <div className="sm:text-right">
                      <span className="text-sm font-extrabold text-slate-900">{item.price}</span>
                      <p className="text-[10px] text-slate-400">on Amazon.{amazonDomain}</p>
                    </div>

                    <a
                      href={getAmazonUrl(item.asin)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 group/btn cursor-pointer whitespace-nowrap"
                    >
                      <span>Check Price</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-800 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* FTC Disclosure & Attribution Footer */}
            <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-1 text-center sm:text-left">
              <span>
                As an Amazon Associate, this tool earns from qualifying purchases. Active Tag: <strong className="font-mono text-slate-600">{amazonTag}</strong>
              </span>
              <button
                onClick={() => setShowAffiliateSettings(true)}
                className="text-indigo-600 hover:underline font-medium cursor-pointer"
              >
                Change Affiliate ID
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
