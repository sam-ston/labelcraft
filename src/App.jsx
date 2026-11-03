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
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Plus,
  Minus,
  CheckCircle2,
  Settings,
} from "lucide-react";

// ─── PROGRAMMATIC PRESETS & MULTI-PRODUCT AFFILIATE CATALOG ────────────────
const PRESETS = {
  "avery-5160": {
    name: "Avery 5160 (30-Up)",
    badge: "US Letter • FBA Standard",
    layout: "avery5160",
    symbology: "CODE128",
    defaultSku: "X003A8K9L1",
    defaultTitle: "Lavender Essential Oil - 2oz",
    pageTitle: "Free Avery 5160 Barcode Label Sheet Generator (30-Up)",
    slotsCount: 30,
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
    slotsCount: 1,
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
    name: "Avery 5163 Box (10-Up)",
    badge: "Carton & Shipping 4x2\"",
    layout: "avery5163",
    symbology: "CODE128",
    defaultSku: "BOX-CARTON-0042",
    defaultTitle: "Master Case - 24 Units Fragile",
    pageTitle: "Avery 5163 10-Up FBA Box & Carton Label Generator",
    slotsCount: 10,
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
  "avery-l7160": {
    name: "Avery L7160 (A4 21-Up)",
    badge: "European / UK Standard",
    layout: "averyl7160",
    symbology: "CODE128",
    defaultSku: "X009EU844L",
    defaultTitle: "Organic Herbal Tea - 100g",
    pageTitle: "Avery L7160 21-Up Barcode Generator (A4 European FBA)",
    slotsCount: 21,
    affiliateSupplies: [
      {
        id: "avery-l7160-paper",
        tag: "EU FBA Standard",
        badgeColor: "bg-amber-100 text-amber-800",
        title: "Avery L7160 A4 Printable Address Labels (2,100 pk)",
        specs: "63.5 x 38.1 mm • 100 A4 Sheets • Jam-Free Laser Printing",
        rating: 4.8,
        reviews: "19,800+",
        price: "£16.99",
        asin: "B00004Z5S1",
        prime: true,
      },
      {
        id: "netum-eu-scanner",
        tag: "Amazon's Choice",
        badgeColor: "bg-indigo-100 text-indigo-800",
        title: "Netum Wireless Bluetooth 1D/2D Barcode Scanner",
        specs: "Fast verification for European EAN & Amazon FNSKU codes",
        rating: 4.6,
        reviews: "3,950+",
        price: "£26.99",
        asin: "B07T2Q3B7N",
        prime: true,
      },
      {
        id: "brother-laser",
        tag: "Workplace Pick",
        badgeColor: "bg-emerald-100 text-emerald-800",
        title: "Brother HL-L2400DWE Wireless Mono Laser Printer",
        specs: "Fast 30ppm • Crisp barcodes without ink bleeding",
        rating: 4.5,
        reviews: "8,700+",
        price: "£119.00",
        asin: "B0CJ484C2X",
        prime: true,
      },
    ],
  },
};

// ─── VALIDATION HELPER ───────────────────────────────────────────────────────
const validateBarcode = (val, sym) => {
  if (!val || val.trim().length === 0) {
    return { valid: false, error: "Please enter a barcode number or SKU." };
  }
  const str = val.trim();
  if (sym === "UPC") {
    if (!/^\d+$/.test(str)) return { valid: false, error: "UPC-A must contain numbers only." };
    if (str.length !== 11 && str.length !== 12) {
      return { valid: false, error: `UPC-A requires 11 or 12 digits (currently ${str.length}).` };
    }
  } else if (sym === "EAN13") {
    if (!/^\d+$/.test(str)) return { valid: false, error: "EAN-13 must contain numbers only." };
    if (str.length !== 12 && str.length !== 13) {
      return { valid: false, error: `EAN-13 requires 12 or 13 digits (currently ${str.length}).` };
    }
  } else if (sym === "CODE128") {
    if (!/^[\x20-\x7E]+$/.test(str)) {
      return { valid: false, error: "Code 128 accepts standard alphanumeric characters." };
    }
  }
  return { valid: true, error: "" };
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

  // Affiliate state (quietly accessible via footer or query param)
  const [amazonTag, setAmazonTag] = useState(() => {
    try {
      const urlParam = new URLSearchParams(window.location.search).get("tag");
      return urlParam || localStorage.getItem("labelcraft_amazon_tag") || "labelcraft-20";
    } catch {
      return "labelcraft-20";
    }
  });
  const [amazonDomain, setAmazonDomain] = useState(() => {
    try {
      return localStorage.getItem("labelcraft_amazon_domain") || (currentRoute === "avery-l7160" ? "co.uk" : "com");
    } catch {
      return "com";
    }
  });
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

  // Batch CSV state
  const [batchItems, setBatchItems] = useState([
    { sku: "X003A8K9L1", title: "Lavender Oil 2oz", condition: "Condition: New", quantity: 6 },
    { sku: "X0088Z11Q2", title: "Tea Tree Soap Bar", condition: "Condition: New", quantity: 12 },
    { sku: "X0091L00M4", title: "Eucalyptus Bath Salts", condition: "Condition: New", quantity: 12 },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingTestSheet, setIsGeneratingTestSheet] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [liveBarcodeUrl, setLiveBarcodeUrl] = useState("");

  const barcodeCanvasRef = useRef(null);
  const validation = validateBarcode(barcodeValue, symbology);

  // URL state synchronization on load
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, "");
    const param = new URLSearchParams(window.location.search).get("preset");
    const target = PRESETS[path] ? path : PRESETS[param] ? param : null;
    if (target) {
      setCurrentRoute(target);
    }
  }, []);

  // Update route, sync supplies, and push to history (preserves user input by default)
  const handleSelectRoute = (key, preserveInput = true) => {
    setCurrentRoute(key);
    setLayout(PRESETS[key].layout);
    if (!preserveInput) {
      setBarcodeValue(PRESETS[key].defaultSku);
      setItemTitle(PRESETS[key].defaultTitle);
    }
    if (key === "avery-l7160") {
      setAmazonDomain("co.uk");
    } else {
      setAmazonDomain("com");
    }
    document.title = PRESETS[key].pageTitle;
    try {
      window.history.pushState({}, "", `/${key}${window.location.search}`);
    } catch {}
  };

  // Re-generate live canvas preview & extract clean data URL
  useEffect(() => {
    if (!barcodeValue || !validation.valid || mode === "batch") return;
    try {
      JsBarcode(barcodeCanvasRef.current, barcodeValue.trim(), {
        format: symbology,
        width: 1.8,
        height: 46,
        displayValue: true,
        fontSize: 12,
        margin: 4,
        background: "#ffffff",
      });
      if (barcodeCanvasRef.current) {
        setLiveBarcodeUrl(barcodeCanvasRef.current.toDataURL("image/png"));
      }
    } catch (e) {
      console.warn("JsBarcode preview error:", e);
    }
  }, [barcodeValue, symbology, mode, validation.valid]);

  // CSV Upload handler
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
            quantity: Math.max(1, parseInt(parts[3]) || 1),
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
      "012345678905,Travel Toiletry Bag,Condition: New,5\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_inventory_barcodes.csv";
    link.click();
  };

  const generateBarcodePngBytes = (sku, sym = "CODE128") => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, sku.trim(), {
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

  const getAmazonUrl = (asin) => {
    return `https://www.amazon.${amazonDomain}/dp/${asin}?tag=${encodeURIComponent(amazonTag)}`;
  };

  // Linear label stream for batch mode
  const getFlattenedLabelStream = () => {
    if (mode === "single") {
      return Array.from({ length: quantity }, () => ({
        sku: barcodeValue,
        title: itemTitle,
        condition: itemCondition,
        sym: symbology,
      }));
    }
    const stream = [];
    batchItems.forEach((item) => {
      for (let q = 0; q < item.quantity; q++) {
        stream.push({
          sku: item.sku,
          title: item.title,
          condition: item.condition,
          sym: symbology,
        });
      }
    });
    return stream;
  };

  // ─── PDF PRINT GENERATOR ────────────────────────────────────────────────────
  const handleGeneratePdf = async () => {
    if (mode === "single" && !validation.valid) return;
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const labelStream = getFlattenedLabelStream();
      const barcodeCache = {};
      const uniqueSkus = [...new Set(labelStream.map((l) => l.sku))];
      for (const sku of uniqueSkus) {
        try {
          const pngBytes = generateBarcodePngBytes(sku, symbology);
          barcodeCache[sku] = await pdfDoc.embedPng(pngBytes);
        } catch (e) {
          console.warn("Could not render SKU:", sku, e);
        }
      }

      // ── 1. AVERY 5160 (30-Up Letter: 3 cols x 10 rows)
      if (layout === "avery5160") {
        const pageWidth = 612; // 8.5" * 72
        const pageHeight = 792; // 11" * 72
        const labelWidth = 189; // 2.625"
        const labelHeight = 72; // 1.0"
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
      }

      // ── 2. AVERY 5163 (10-Up Letter Box / Carton: 2 cols x 5 rows)
      else if (layout === "avery5163") {
        const pageWidth = 612;
        const pageHeight = 792;
        const labelWidth = 288; // 4.0"
        const labelHeight = 144; // 2.0"
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
      }

      // ── 3. AVERY L7160 (A4 European 21-Up: 3 cols x 7 rows)
      else if (layout === "averyl7160") {
        const pageWidth = 595.28; // 210mm
        const pageHeight = 841.89; // 297mm
        const labelWidth = 180.0; // 63.5mm
        const labelHeight = 108.0; // 38.1mm
        const leftMargin = 20.41; // 7.2mm
        const topMargin = 42.94; // 15.15mm
        const colPitch = 187.09; // 66.0mm
        const rowPitch = 108.0; // 38.1mm

        const totalSlots = startOffset + labelStream.length;
        const totalPages = Math.ceil(totalSlots / 21);
        let streamIdx = 0;
        let globalSlot = 0;

        for (let p = 0; p < totalPages; p++) {
          const page = pdfDoc.addPage([pageWidth, pageHeight]);
          for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 3; col++) {
              if (globalSlot >= startOffset && streamIdx < labelStream.length) {
                const item = labelStream[streamIdx];
                const x = leftMargin + col * colPitch;
                const y = pageHeight - (topMargin + (row + 1) * rowPitch);

                if (item.title) {
                  const title = item.title.length > 34 ? item.title.slice(0, 34) + "..." : item.title;
                  const titleWidth = helveticaBold.widthOfTextAtSize(title, 8);
                  page.drawText(title, {
                    x: x + Math.max(4, (labelWidth - titleWidth) / 2),
                    y: y + labelHeight - 16,
                    size: 8,
                    font: helveticaBold,
                    color: rgb(0.1, 0.1, 0.1),
                  });
                }

                const embeddedPng = barcodeCache[item.sku];
                if (embeddedPng) {
                  const bcWidth = 148;
                  const bcHeight = 56;
                  page.drawImage(embeddedPng, {
                    x: x + (labelWidth - bcWidth) / 2,
                    y: y + 26,
                    width: bcWidth,
                    height: bcHeight,
                  });
                }

                if (item.condition) {
                  const condWidth = helvetica.widthOfTextAtSize(item.condition, 7);
                  page.drawText(item.condition, {
                    x: x + (labelWidth - condWidth) / 2,
                    y: y + 10,
                    size: 7,
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
      }

      // ── 4. DIRECT THERMAL ROLL (2.25" x 1.25")
      else if (layout === "thermal2x1") {
        for (const item of labelStream) {
          const page = pdfDoc.addPage([162, 90]);

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

  // ─── ZERO-INK TEST SHEET GENERATOR (FOR ALIGNMENT TESTING) ─────────────────
  const handleGenerateTestSheet = async () => {
    setIsGeneratingTestSheet(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const outlineColor = rgb(0.55, 0.6, 0.75); // light indigo/slate
      const textColor = rgb(0.4, 0.45, 0.55);

      if (layout === "avery5160") {
        const page = pdfDoc.addPage([612, 792]);
        page.drawText("ALIGNMENT TEST SHEET — Print at 100% Scale on plain paper to test against your Avery 5160 sheet", {
          x: 20,
          y: 775,
          size: 7,
          font: helveticaBold,
          color: textColor,
        });

        for (let row = 0; row < 10; row++) {
          for (let col = 0; col < 3; col++) {
            const x = 13.5 + col * 198;
            const y = 792 - (36 + (row + 1) * 72);
            page.drawRectangle({
              x,
              y,
              width: 189,
              height: 72,
              borderColor: outlineColor,
              borderWidth: 0.75,
            });
            const slotNum = `Slot #${row * 3 + col + 1}`;
            page.drawText(slotNum, {
              x: x + 72,
              y: y + 32,
              size: 8,
              font: helvetica,
              color: textColor,
            });
          }
        }
      } else if (layout === "averyl7160") {
        const page = pdfDoc.addPage([595.28, 841.89]);
        page.drawText("A4 ALIGNMENT TEST SHEET — Avery L7160 (21-Up) — Print at 100% Scale", {
          x: 20,
          y: 825,
          size: 7,
          font: helveticaBold,
          color: textColor,
        });

        for (let row = 0; row < 7; row++) {
          for (let col = 0; col < 3; col++) {
            const x = 20.41 + col * 187.09;
            const y = 841.89 - (42.94 + (row + 1) * 108.0);
            page.drawRectangle({
              x,
              y,
              width: 180.0,
              height: 108.0,
              borderColor: outlineColor,
              borderWidth: 0.75,
            });
            const slotNum = `Slot #${row * 3 + col + 1}`;
            page.drawText(slotNum, {
              x: x + 70,
              y: y + 50,
              size: 8,
              font: helvetica,
              color: textColor,
            });
          }
        }
      } else if (layout === "avery5163") {
        const page = pdfDoc.addPage([612, 792]);
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 2; col++) {
            const x = 12 + col * 300;
            const y = 792 - (36 + (row + 1) * 144);
            page.drawRectangle({
              x,
              y,
              width: 288,
              height: 144,
              borderColor: outlineColor,
              borderWidth: 0.75,
            });
            const slotNum = `Box Slot #${row * 2 + col + 1} (4" x 2")`;
            page.drawText(slotNum, {
              x: x + 90,
              y: y + 68,
              size: 10,
              font: helvetica,
              color: textColor,
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `alignment_test_sheet_${layout}.pdf`;
      link.click();
    } catch (e) {
      console.error("Test sheet generation failed:", e);
    } finally {
      setIsGeneratingTestSheet(false);
    }
  };

  const totalBatchCount = batchItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const streamForPreview = getFlattenedLabelStream();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <div>
        {/* ── TOP NAV BAR ──────────────────────────────────────────────────────── */}
        <header className="border-b bg-white border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">LabelCraft</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    100% Private
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Preset Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {Object.keys(PRESETS).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectRoute(key)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentRoute === key
                      ? "bg-white text-indigo-700 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {PRESETS[key].name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Client-Side Only
              </span>
            </div>
          </div>

          {/* Mobile Format Switcher Tab Bar */}
          <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1.5 bg-slate-50">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectRoute(key)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all cursor-pointer shrink-0 ${
                  currentRoute === key
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700"
                }`}
              >
                {PRESETS[key].name}
              </button>
            ))}
          </div>
        </header>

        {/* ── MAIN WORKSPACE ───────────────────────────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & CSV Controls */}
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

              {/* ── SINGLE SKU MODE ────────────────────────────────────────── */}
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
                              ? "bg-indigo-50 border-indigo-600 text-indigo-700 font-bold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {sym === "CODE128" ? "FNSKU / 128" : sym === "UPC" ? "UPC-A" : "EAN-13"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Barcode Number / SKU
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {symbology === "UPC" ? "12 digits" : symbology === "EAN13" ? "13 digits" : "Alphanumeric"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={barcodeValue}
                      onChange={(e) => setBarcodeValue(e.target.value)}
                      placeholder={symbology === "UPC" ? "012345678905" : "X003A8K9L1"}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono outline-none focus:ring-2 focus:bg-white transition-all ${
                        !validation.valid
                          ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-300 focus:ring-indigo-500"
                      }`}
                    />
                    {!validation.valid && (
                      <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {validation.error}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Product Title (Optional)
                      </label>
                      <span className="text-[10px] text-slate-400">{itemTitle.length}/36</span>
                    </div>
                    <input
                      type="text"
                      value={itemTitle}
                      onChange={(e) => setItemTitle(e.target.value)}
                      placeholder="Product Description (e.g. Lavender Soap - Pack of 2)"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                      Condition Subtext (Optional)
                    </label>
                    <input
                      type="text"
                      value={itemCondition}
                      onChange={(e) => setItemCondition(e.target.value)}
                      placeholder="Condition: New"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="600"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                      />
                    </div>
                    {layout !== "thermal2x1" && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Skip Used Slots
                          </label>
                          <span className="text-[10px] text-indigo-600 font-bold">Reuse Sheet</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={layout === "avery5160" ? 29 : layout === "averyl7160" ? 20 : 9}
                          value={startOffset}
                          onChange={(e) => setStartOffset(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ── BATCH CSV MODE ─────────────────────────────────────────── */
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl p-4 text-center hover:bg-indigo-50/40 transition-all cursor-pointer relative">
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
                    <span className="font-bold text-slate-800">
                      {batchItems.length} SKUs ({totalBatchCount} total labels)
                    </span>
                    <button
                      onClick={handleDownloadSampleCsv}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" /> Sample CSV
                    </button>
                  </div>

                  {/* Batch Table with Inline Editing */}
                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y text-xs">
                    {batchItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50">
                        <div className="truncate flex-1 min-w-0">
                          <span className="font-mono font-bold text-slate-900">{item.sku}</span>
                          <p className="text-[11px] text-slate-500 truncate">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              const updated = [...batchItems];
                              updated[idx].quantity = Math.max(1, updated[idx].quantity - 1);
                              setBatchItems(updated);
                            }}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-[11px] text-indigo-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const updated = [...batchItems];
                              updated[idx].quantity = updated[idx].quantity + 1;
                              setBatchItems(updated);
                            }}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setBatchItems(batchItems.filter((_, i) => i !== idx))}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Format Selection Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                  Destination Sheet Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "avery5160", route: "avery-5160", name: "Avery 5160", desc: "US Letter • 30-Up" },
                    { id: "thermal2x1", route: "thermal-2x1", name: "Thermal Roll", desc: "2.25\" x 1.25\" Continuous" },
                    { id: "averyl7160", route: "avery-l7160", name: "Avery L7160", desc: "A4 European • 21-Up" },
                    { id: "avery5163", route: "avery-5163-box", name: "Avery 5163", desc: "Box / Carton • 10-Up" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectRoute(l.route, true)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        layout === l.id
                          ? "border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold ring-1 ring-indigo-500/20"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <p className="text-xs">{l.name}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Download PDF & Zero-Ink Test Sheet */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGeneratePdf}
                  disabled={isGenerating || (mode === "single" ? !validation.valid : batchItems.length === 0)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Rendering PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download Print-Ready PDF
                    </>
                  )}
                </button>

                {layout !== "thermal2x1" && (
                  <button
                    onClick={handleGenerateTestSheet}
                    disabled={isGeneratingTestSheet}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Download Alignment Test Sheet (Zero Ink)
                  </button>
                )}
              </div>
            </div>

            <canvas ref={barcodeCanvasRef} className="hidden" />
          </section>

          {/* Right Column: Live Alignment Preview & Amazon Supplies */}
          <section className="lg:col-span-7 space-y-6">
            {/* Live Sheet Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Print Alignment Preview</h3>
                  <p className="text-xs text-slate-500">
                    {layout === "avery5160" && "Avery 5160 • 30 labels (8.5\" × 11\" Letter)"}
                    {layout === "averyl7160" && "Avery L7160 • 21 labels (A4 210 × 297 mm)"}
                    {layout === "avery5163" && "Avery 5163 • 10 master carton labels (4\" × 2\")"}
                    {layout === "thermal2x1" && "Direct Thermal Continuous Roll (2.25\" × 1.25\")"}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-mono text-slate-700 font-bold">
                  {mode === "single" ? `${quantity} labels` : `${totalBatchCount} batch labels`}
                </span>
              </div>

              {/* ⚠️ CRITICAL PRINT SETTING CALIBRATION CALLOUT */}
              <div className="mb-4 bg-amber-50/80 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-950">Crucial Printer Setting:</strong> In your print dialog, set{" "}
                  <strong>Scale to 100% (Actual Size)</strong>. Do NOT select "Fit to Printable Area" as it shrinks labels and ruins alignment.
                </div>
              </div>

              {/* Dynamic Live Grid (Displays Real Data in Batch Mode) */}
              {layout === "avery5160" && (
                <div className="border border-slate-300 rounded-xl p-3 bg-slate-100 aspect-[8.5/11] max-h-[460px] overflow-hidden flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-1.5 h-full">
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const isSkipped = idx < startOffset;
                      const streamIdx = idx - startOffset;
                      const item = isSkipped ? null : streamForPreview[streamIdx];
                      const isFilled = !isSkipped && !!item;

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
                                {item.title || "SKU LABEL"}
                              </p>
                              <div className="h-4 w-4/5 bg-slate-900 my-0.5 rounded-2xs flex items-center justify-center text-[5px] text-white font-mono">
                                ||||||||||||||||
                              </div>
                              <p className="text-[6px] font-mono text-slate-600 leading-none truncate max-w-full">
                                {item.sku}
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

              {layout === "averyl7160" && (
                <div className="border border-slate-300 rounded-xl p-3 bg-slate-100 aspect-[1/1.414] max-h-[460px] overflow-hidden flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-1.5 h-full">
                    {Array.from({ length: 21 }).map((_, idx) => {
                      const isSkipped = idx < startOffset;
                      const streamIdx = idx - startOffset;
                      const item = isSkipped ? null : streamForPreview[streamIdx];
                      const isFilled = !isSkipped && !!item;

                      return (
                        <div
                          key={idx}
                          className={`rounded border flex flex-col items-center justify-center p-1.5 text-center transition-all ${
                            isSkipped
                              ? "bg-slate-200 border-dashed border-slate-300 opacity-40"
                              : isFilled
                              ? "bg-white border-slate-300 shadow-2xs"
                              : "bg-slate-50 border-slate-200 opacity-20"
                          }`}
                        >
                          {isFilled && (
                            <>
                              <p className="text-[8px] font-bold truncate max-w-full text-slate-800 leading-tight">
                                {item.title || "A4 SKU LABEL"}
                              </p>
                              <div className="h-5 w-4/5 bg-slate-900 my-1 rounded-2xs flex items-center justify-center text-[6px] text-white font-mono">
                                ||||||||||||||||||||
                              </div>
                              <p className="text-[7px] font-mono text-slate-600 leading-none truncate max-w-full">
                                {item.sku}
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
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const isSkipped = idx < startOffset;
                      const streamIdx = idx - startOffset;
                      const item = isSkipped ? null : streamForPreview[streamIdx];
                      const isFilled = !isSkipped && !!item;

                      return (
                        <div
                          key={idx}
                          className={`border rounded-lg p-3 flex flex-col justify-between transition-all ${
                            isSkipped
                              ? "bg-slate-200 border-dashed border-slate-300 opacity-40"
                              : isFilled
                              ? "bg-white border-slate-300 shadow-2xs"
                              : "bg-slate-50 border-slate-200 opacity-20"
                          }`}
                        >
                          {isFilled && (
                            <>
                              <p className="text-[9px] font-bold text-slate-800 truncate text-center">
                                {item.title || "MASTER CARTON SKU"}
                              </p>
                              <div className="h-9 w-full bg-slate-900 rounded flex items-center justify-center text-[8px] text-white font-mono">
                                ||||||||||||||||||||||||||||||||||||
                              </div>
                              <div className="flex justify-between text-[7px] font-mono text-slate-500">
                                <span>{item.sku}</span>
                                <span>{item.condition}</span>
                              </div>
                            </>
                          )}
                          {isSkipped && <span className="text-xs text-slate-400 font-medium text-center my-auto">Slot Used</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {layout === "thermal2x1" && (
                <div className="border border-slate-300 rounded-xl p-8 bg-slate-100 flex items-center justify-center min-h-[300px]">
                  <div className="bg-white border border-slate-300 rounded-xl shadow-md p-4 w-64 h-38 flex flex-col justify-between items-center text-center transition-all">
                    <p className="text-xs font-bold text-slate-900 truncate w-full">{itemTitle || "Product Title"}</p>
                    <div className="my-1 flex items-center justify-center w-full min-h-[58px]">
                      {liveBarcodeUrl ? (
                        <img src={liveBarcodeUrl} alt="Barcode Preview" className="h-14 w-auto max-w-[220px] object-contain" />
                      ) : (
                        <div className="h-12 w-4/5 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          Generating Barcode...
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-700">{barcodeValue}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{itemCondition}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── HIGH-CONVERTING AMAZON AFFILIATE CARDS ─────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                            prime <span className="font-normal not-italic text-[10px] text-slate-500">FREE Delivery</span>
                          </span>
                        )}
                      </div>

                      <h5 className="font-semibold text-xs text-slate-900 group-hover:text-amber-900 transition-colors leading-snug">
                        {item.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.specs}
                      </p>

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
                        <span>View on Amazon</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-800 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>As an Amazon Associate, this tool earns from qualifying purchases.</span>
                <span className="font-mono text-slate-500">Tag: {amazonTag}</span>
              </div>
            </div>
          </section>
        </main>

        {/* ── EXPANDABLE FAQ & TROUBLESHOOTING GUIDE (FOR SEO & SELLERS) ─────── */}
        <section className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-200/80 mt-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions & Print Calibration Guide
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Everything you need to know about Amazon FBA barcode compliance, Avery alignment, and print settings.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Why do my Avery 5160 labels misalign or drift downwards across the sheet?",
                a: "In 95% of cases, misalignment is caused by your PDF viewer or browser print dialog automatically selecting 'Fit to Printable Area' or 'Scale to Fit'. When printed with scaling enabled, the entire 30-label grid shrinks by 3% to 5%, causing lower rows to print across the physical perforations. In your print dialog, always set Page Sizing to 'Actual Size' (100%) and Margins to 'None' or 'Default'.",
              },
              {
                q: "What is an Amazon FNSKU barcode and how does it differ from a UPC barcode?",
                a: "An FNSKU (Fulfillment Network Stock Keeping Unit, typically starting with X00...) is Amazon's proprietary barcode that ties an individual item specifically to your seller account. A UPC barcode is a universal 12-digit commercial barcode that identifies the product in general retail. Amazon FBA requires an FNSKU label on every individual unit unless you use commingled manufacturer barcode inventory.",
              },
              {
                q: "Can I print barcode labels with an inkjet printer or do I need laser/thermal?",
                a: "You can print with an inkjet printer, but you must use high-quality smudge-proof matte label paper (such as Avery 5160). Low-end inkjet prints can smudge if exposed to moisture, causing Amazon fulfillment center scanners to reject the inventory. For commercial sellers doing more than 50 units weekly, a direct thermal printer (Munbyn or Rollo) is highly recommended because it uses heat rather than ink, preventing any risk of smearing.",
              },
              {
                q: "How does the 'Skip Used Slots' feature work?",
                a: "Standard Avery sheets contain 30 stickers. If you only printed 10 stickers yesterday, you have 20 blank stickers remaining. Entering '10' into 'Skip Used Slots' tells the PDF generator to leave the first 10 grid slots completely blank and begin printing on slot #11, allowing you to reuse partially printed sticker sheets without wasting money on blank paper.",
              },
              {
                q: "Is my inventory data, SKU list, or customer information uploaded to any server?",
                a: "No. LabelCraft is built with a 100% client-side architecture. All barcode compilation, SVG vector rendering, and PDF assembly execute entirely in your computer's local web browser runtime. No file bytes or SKU data are ever transmitted to any remote cloud server, ensuring complete data privacy and GDPR/SOC-2 compliance.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight">LabelCraft</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-600">Free Calibrated Barcode Label Sheet Generator</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap justify-center">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectRoute(key, true)}
                className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                  currentRoute === key ? "font-bold text-indigo-600" : ""
                }`}
              >
                {PRESETS[key].name}
              </button>
            ))}
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setShowAffiliateModal(true)}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Settings className="w-3 h-3" /> Settings
            </button>
          </div>

          <div className="text-[10px] text-slate-400">
            100% Client-Side Privacy • Zero Data Uploads
          </div>
        </div>
      </footer>

      {/* ── DISCREET AFFILIATE TAG SETTINGS MODAL ─────────────────────────────── */}
      {showAffiliateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Amazon Affiliate Configuration</h4>
              <button
                onClick={() => setShowAffiliateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Set your personal Amazon Associates tag to test outbound supply link monetization.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tracking Tag</label>
                <input
                  type="text"
                  value={amazonTag}
                  onChange={(e) => {
                    setAmazonTag(e.target.value);
                    localStorage.setItem("labelcraft_amazon_tag", e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Amazon Country Domain</label>
                <select
                  value={amazonDomain}
                  onChange={(e) => {
                    setAmazonDomain(e.target.value);
                    localStorage.setItem("labelcraft_amazon_domain", e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="com">Amazon.com (United States)</option>
                  <option value="co.uk">Amazon.co.uk (United Kingdom)</option>
                  <option value="ca">Amazon.ca (Canada)</option>
                  <option value="de">Amazon.de (Germany)</option>
                  <option value="fr">Amazon.fr (France)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowAffiliateModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
