let orderDataItems;
function helper(){
  // First create the page preview to display on screen
  createPagePreview();
  
  // Then print the page
  printPage(orderDataItems);
}

// Helper function to format currency values with comma separators
function formatCurrency(value) {
  if (!value || value === '') return '';
  
  // Convert to string and handle both number and string inputs
  const numStr = String(value).trim();
  
  // If it's not a valid number, return as is
  if (isNaN(parseFloat(numStr))) return numStr;
  
  // Split into integer and decimal parts
  const parts = numStr.split('.');
  
  // Format integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Join with decimal part if it exists
  return parts.length > 1 ? parts.join('.') : parts[0];
}
function printPage(orderData) {
  if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
    console.error("Invalid order data for printing", orderData);
    alert("Error: Invalid data for printing");
    return;
  }

  // Format current date for timestamp
  const now = new Date();
  const timestamp = now.toLocaleString();

  // Sync header values before printing
  syncHeaderData();

  // Clean up any previous print containers
  const existingContainer = document.getElementById("print-container");
  if (existingContainer) existingContainer.remove();

  const existingStyle = document.getElementById("print-style");
  if (existingStyle) existingStyle.remove();

  // Create a container for print content
  const printContainer = document.createElement("div");
  printContainer.id = "print-container";
  printContainer.style.display = "none";
  document.body.appendChild(printContainer);

  // Create a style element for print
  const printStyle = document.createElement("style");
  printStyle.id = "print-style";
  printStyle.innerHTML = `
        @media print {
            body > *:not(#print-container) {
                display: none !important;
            }
            
            #print-container {
                display: block !important;
                font-family: 'Aptos', sans-serif !important;
            }
            
            .print-page {
                width: 100%;
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                page-break-after: always;
            }
            
            .print-page:last-child {
                page-break-after: auto;
            }
            
            .header-for-print {
                display: block !important;
            
            }
            
            .company-info {
                color: #0072bc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .company-info h2 {
                color: #0072bc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-size: 20px !important;
                
            }
            
            .company-info p {
                font-size: 12px !important;
                line-height: 1.3 !important;
                margin: 0 0 2px 0 !important;
                color: black !important;
            }
            
            .dual-tables {
                display: flex !important;
                justify-content: space-between !important;
                margin-bottom: 15px !important;
                gap: 15px !important;
                margin: 1cm;
               
              
            }
            
            /* Left-right tables for headers */
            .left-table, .right-table {
                display: none !important;
            }
               
            /* Strict table styling for consistent borders */
            .left-table-html, .right-table-html {
                width: 100% !important;
                border-collapse: collapse !important;
                border: 1px solid #000 !important;
                
                border-spacing: 0 !important;
                table-layout: fixed !important;
            }
            
            .left-table-html {
                flex: 60 !important;
                width: 60% !important;
            }
            
            .right-table-html {
                flex: 40 !important;
                width: 40% !important;
                margin-right:-25px;
                
            }
            
            /* Ensure consistent border rendering for all cells */
            .left-table-html th, .right-table-html th,
            .left-table-html td, .right-table-html td {
                border: 1px solid #000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .left-table-html th, .right-table-html th {
                background-color: #f0f0f0 !important;
                padding: 6px 8px !important;
                font-size: 14px !important;
                font-weight: bold !important;
                text-align: center !important;
            }
            
            .left-table-html td, .right-table-html td {
                padding: 4px 8px !important;
                font-size: 11px !important;
                height: 24px !important;
                box-sizing: border-box !important;
                vertical-align: middle !important;
            }
            
           
            .empty-row td {
                background-color: #f9f9f9 !important;
            }
            
            /* Special handling for empty cells */
            .label-empty {
                border-right: none !important;
            }
            
            .value-empty {
                border-left: none !important;
            }
            
            /* Reset border style for special cases */
            .left-table-html tr:first-child th {
                border-top: 1px solid #000 !important;
                border-left: 1px solid #000 !important;
                border-right: 1px solid #000 !important;
                border-bottom: 1px solid #000 !important;
            }
            
            .right-table-html tr:first-child th {
                border-top: 1px solid #000 !important;
                border-left: 1px solid #000 !important;
                border-right: 1px solid #000 !important;
                border-bottom: 1px solid #000 !important;
            }

           
            .left-table-html tr:last-child td, 
            .right-table-html tr:last-child td {
                border-bottom: 1px solid #000 !important;
            }
            
            .intro-text {
                font-size: 12px !important;
                margin-bottom: 15px !important;
                line-height: 1.3 !important;
            }
            
            .content-container {
                margin-top: 15px;
                display: block;
            }
            
            .main-table {
                border: 1px solid #000 !important;
                width: 100% !important;
                border-collapse: collapse !important;
                table-layout: fixed !important;
                margin-bottom: 15px !important;
                border-spacing: 0 !important;
            }
            
            .main-table thead {
                display: table-header-group !important;
            }
            
            /* Enforce consistent border for main table cells */
            .main-table th, .main-table td {
                border: 1px solid #000 !important;
                padding: 6px 4px !important;
                font-size: 11px !important;
                vertical-align: top !important;
                overflow: hidden !important;
                line-height: 1.3 !important;
                -webkit-print-color-adjust: exact !important;
                   page-break-inside:  auto!important;
                print-color-adjust: exact !important;
            }
            
            .main-table th {
                background-color: #f0f0f0 !important;
                font-weight: bold !important;
                font-size: 11px !important;
                white-space: normal !important;
            }
            
            .footer-content {
                margin-top: 20px !important;
            }
            
            .delivery-note {
                color: #0072bc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 10px 0 !important;
                font-size: 14.1px !important;
                line-height: 1.4 !important;
                font-weight: 500 !important;
                text-align:center
            }
            
            .terms-table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-bottom: 15px !important;
                border: 1px solid black !important;
                border-spacing: 0 !important;
                border-top:2px solid black !important;
                border-left:1px solid black !important;
                
            }
            
            .terms-row {
                display: flex !important;
               
            }
            
            .terms-row:last-child {
                border-bottom: black !important;
            }
            
            .terms-cell {
                padding: 6px 8px !important;
                font-size: 11px !important;
                line-height: 1.3 !important;
               
                vertical-align: top !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            
            
            .header-row .terms-cell {
                background-color: #f5f5f5 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-weight: 600 !important;
            }
            
            .note-section {
                font-size: 11px !important;
                line-height: 1.4 !important;
            }
            
            .note-section p {
                margin: 0 0 8px 0 !important;
            }
            
            .note-section ul {
                margin: 0 0 10px 0 !important;
                padding-left: 20px !important;
            }
            
            .note-section li {
                margin-bottom: 5px !important;
            }
            
           
            
           
           
            /* Control column widths */
            .main-table th:nth-child(1),
            .main-table td:nth-child(1) {
                width: 5% !important;
                text-align: center !important;
                 vertical-align: top;
            }
            
            .main-table th:nth-child(2), 
            .main-table td:nth-child(2) {
                width: 36% !important;
                text-align: left !important;
                white-space: normal !important;
                 vertical-align: top;
                 page-break-inside:  auto!important;
            }
            
            .main-table th:nth-child(3),
            .main-table td:nth-child(3) {
                width: 12% !important;
                text-align: center !important;
                 vertical-align: top;
            }
            
            .main-table th:nth-child(4), 
            .main-table td:nth-child(4){
                width: 6% !important;
                text-align: center !important;
                 vertical-align: top;
            }
               .logo-container {
               text-align: right;
               margin-right: -65px;}

            .main-table th:nth-child(5), 
            .main-table td:nth-child(5) {
                width: 6% !important;
                text-align: center !important;
                 vertical-align: top;
            }
            
            .main-table th:nth-child(6), 
            .main-table td:nth-child(6) {
                width: 10% !important;
                text-align: right !important;
                 vertical-align: top;
            }
            
            .main-table th:nth-child(7), 
            .main-table td:nth-child(7) {
                width: 9% !important;
                text-align: right !important;
                 vertical-align: top;
            }
            
            .main-table th:nth-child(8), 
            .main-table td:nth-child(8),
            .main-table th:nth-child(9), 
            .main-table td:nth-child(9) {
                width: 7% !important;
                text-align: right !important;
                 vertical-align: top;
            }
            
            @page {
                margin: 1.5cm 1cm 1.5cm 1.5cm;
                size: A4 portrait;
            }
        }
    `;
  document.head.appendChild(printStyle);

  // Get the original header template
  const headerTemplate = document.getElementById("header-template");
  const headerClone = headerTemplate.cloneNode(true);
  headerClone.style.display = "block";
  headerClone.classList.add("header-for-print");

  // Get the original items
  const itemsTable = document.getElementById("items-table-body");
  if (!itemsTable) {
    console.error("Items table not found");
    return;
  }

  const items = Array.from(itemsTable.querySelectorAll("tr"));
  if (items.length === 0) {
    console.warn("No items found in the table");
  }

  // Create an offscreen container to measure row heights
  const measureContainer = document.createElement("div");
  measureContainer.style.position = "absolute";
  measureContainer.style.left = "-9999px";
  measureContainer.style.width = "210mm"; // A4 width
  document.body.appendChild(measureContainer);

  // Function to measure element height
  function measureElementHeight(element) {
    const clone = element.cloneNode(true);
    measureContainer.appendChild(clone);
    const height = clone.offsetHeight;
    measureContainer.removeChild(clone);
    return height;
  }

  // Measure header height
  const headerHeight = measureElementHeight(headerClone);

  // Create a sample table header to measure
  const tableHeader = document.createElement("thead");
  tableHeader.innerHTML = `
            <tr>
                <th>No</th>
                <th>Item</th>
                <th>P/N</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Amount</th>
            <th style="text-align: right;">Delivery<br>Time</th>
            <th style="text-align: right;">Ex-<br>Works</th>
            </tr>
        `;
  const tableHeaderHeight = measureElementHeight(tableHeader);

  // Get footer elements
  const footerTemplate = document.getElementById("footer-template");
  const footerClone = footerTemplate.cloneNode(true);
  footerClone.style.display = "block";

  // Measure footer height
  const footerHeight = measureElementHeight(footerClone);

  // Separate regular items from total rows (last 3 rows)
  const totalItems = items.length - 3; // Excluding the 3 total rows
  const regularItems = items.slice(0, totalItems);
  const totalRows = items.slice(totalItems);

  // Measure row heights for regular items
  const rowHeights = regularItems.map((item) => measureElementHeight(item));

  // Calculate available height for content per page
  // A4 is 297mm tall, minus margins and headers
  const a4HeightPx = 297 * 3.7; // Convert mm to px (approximate)
  const marginsPx = 30 * 1.5; // 3cm total margins (1.5cm top + 1.5cm bottom)
  // Add a small buffer (10px) to ensure we don't exceed page height
  const availableHeight =
    a4HeightPx - marginsPx - headerHeight - tableHeaderHeight - 80;

  // Distribute items across pages
  const pages = [];
  let currentPage = [];
  let currentHeight = 0;

  // Process the regular item rows
  for (let i = 0; i < regularItems.length; i++) {
    const item = regularItems[i];
    const rowHeight = rowHeights[i];

    // Check if this row would fit on current page
    if (currentHeight + rowHeight > availableHeight) {
      // This row won't fit, start a new page
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      currentPage = [item];
      currentHeight = rowHeight;
    } else {
      // Add to current page
      currentPage.push(item);
      currentHeight += rowHeight;
    }
  }

  // Add the current page if it has any items
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // Check if there's room for the totals on the last page
  const lastPageHeight = currentPage.reduce((sum, item) => {
    const idx = regularItems.indexOf(item);
    return sum + rowHeights[idx];
  }, 0);

  // Measure total rows height
  const totalsHeight = totalRows.reduce(
    (sum, row) => sum + measureElementHeight(row),
    0
  );

  // Be much more generous with space threshold - allow totals if there's even
  // just 80% of the height used, so we're more likely to keep totals with items
  const footerFitsLastPage =
    lastPageHeight + totalsHeight + footerHeight <= availableHeight ||
    lastPageHeight + footerHeight <= availableHeight * 0.8;

  // Total number of pages needed
  const totalPages = footerFitsLastPage ? pages.length : pages.length + 1;

  // Update all page number displays
  const pageCountElements = document.querySelectorAll(
    "#order-page, #header-order-page"
  );
  let i =0 ;
  pageCountElements.forEach((elem) => {
    if (elem) elem.textContent = `${i++} OF ${totalPages}`;
  });

  // Generate the actual print pages
  pages.forEach((pageItems, pageIndex) => {
    const isLastItemPage = pageIndex === pages.length - 1;

    // Create a page div
    const pageDiv = document.createElement("div");
    pageDiv.className = "print-page";



    // Add document header
    const headerForPage = headerClone.cloneNode(true);

    // Update page number
    const pageNumElem = headerForPage.querySelector("#header-order-page");
    if (pageNumElem) {
      pageNumElem.textContent = `${pageIndex + 1} OF ${totalPages}`;
    }

    // Set date if empty
    const dateElem = headerForPage.querySelector("#header-order-date");
    if (
      dateElem &&
      (!dateElem.textContent || dateElem.textContent.trim() === "")
    ) {
      dateElem.textContent = now.toLocaleDateString();
    }

    pageDiv.appendChild(headerForPage);

    // Create content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "content-container";

    // Create table with items
    const table = document.createElement("table");
    table.className = "main-table";

    // Add table header (appears on every page)
    const thead = document.createElement("thead");
    thead.innerHTML = tableHeader.innerHTML;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    // Add items for this page
    pageItems.forEach((item) => {
      tbody.appendChild(item.cloneNode(true));
    });

    // Add totals to the last item page if they fit
    if (isLastItemPage && footerFitsLastPage) {
      totalRows.forEach((row) => {
        tbody.appendChild(row.cloneNode(true));
      });
    }

    table.appendChild(tbody);
    contentDiv.appendChild(table);
    pageDiv.appendChild(contentDiv);

    // Add footer to the last page if it fits
    if (isLastItemPage && footerFitsLastPage) {
      const footerContent = document.createElement("div");
      footerContent.className = "footer-content";
      footerContent.appendChild(footerClone.cloneNode(true));
      pageDiv.appendChild(footerContent);
    }

    printContainer.appendChild(pageDiv);
  });

  // Create a separate page for totals and footer if needed
  if (!footerFitsLastPage) {
    const footerPage = document.createElement("div");
    footerPage.className = "print-page";

    // Add timestamp

    // Add document header
    const headerForFooterPage = headerClone.cloneNode(true);

    // Update page number
    const pageNumElem = headerForFooterPage.querySelector("#header-order-page");
    if (pageNumElem) {
      pageNumElem.textContent = `${totalPages} OF ${totalPages}`;
    }

    // Set date if empty
    const dateElem = headerForFooterPage.querySelector("#header-order-date");
    if (
      dateElem &&
      (!dateElem.textContent || dateElem.textContent.trim() === "")
    ) {
      dateElem.textContent = now.toLocaleDateString();
    }

    footerPage.appendChild(headerForFooterPage);

    // Create content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "content-container";

    // Create table for totals
    const table = document.createElement("table");
    table.className = "main-table";

    // Add table header
    const thead = document.createElement("thead");
    thead.innerHTML = tableHeader.innerHTML;
    table.appendChild(thead);

    // Create table body with just the totals
    const tbody = document.createElement("tbody");
    totalRows.forEach((row) => {
      tbody.appendChild(row.cloneNode(true));
    });
    table.appendChild(tbody);

    contentDiv.appendChild(table);
    footerPage.appendChild(contentDiv);

    // Add footer content
    const footerContent = document.createElement("div");
    footerContent.className = "footer-content";
    footerContent.appendChild(footerClone.cloneNode(true));
    footerPage.appendChild(footerContent);

    printContainer.appendChild(footerPage);
  }

  // Clean up the measurement container
  document.body.removeChild(measureContainer);

  // Make print container visible
  printContainer.style.display = "block";

  // Trigger print
  setTimeout(() => {
    window.print();

    // Clean up after printing
    setTimeout(() => {
      printContainer.style.display = "none";
      printStyle.remove();
    }, 1000);
  }, 500);
}



// Helper function to sync header data
function syncHeaderData() {
  // Customer data
  syncElementText("customer-country", "header-customer-country");
  syncElementText("customer-attention", "header-customer-attention");
  syncElementText("customer-po", "header-customer-po");
  syncElementText("customer-vessel", "header-customer-vessel");
  syncElementText("customer-equipment", "header-customer-equipment");
  syncElementText("customer-make", "header-customer-make");

  // Order data
  syncElementText("order-ref", "header-order-ref");
  syncElementText("order-date", "header-order-date");
  syncElementText("order-trn", "header-order-trn");
  syncElementText("order-contact", "header-order-contact");
  syncElementText("order-currency", "header-order-currency");
  syncElementText("order-page", "header-order-page");
}

function syncElementText(sourceId, targetId) {
  const sourceElement = document.getElementById(sourceId);
  const targetElement = document.getElementById(targetId);

  if (sourceElement && targetElement) {
    targetElement.textContent = sourceElement.textContent;
  }
}



  
// Function to populate the form with data when the page loads
  window.onload = function () {
    // No need to populate fields with static content in header
    // as they are hardcoded in the HTML to match the photo
  
    // Only populate fields with IDs that should have dynamic content
    if (document.getElementById("header-customer-country")) {
      document.getElementById("header-customer-country").textContent = "";
    }
    
    if (document.getElementById("header-customer-attention")) {
      document.getElementById("header-customer-attention").textContent = "";
    }
  
    if (document.getElementById("header-customer-vessel")) {
      document.getElementById("header-customer-vessel").textContent = "";
    }
  
    if (document.getElementById("header-customer-equipment")) {
      document.getElementById("header-customer-equipment").textContent = "";
    }
  
    if (document.getElementById("header-customer-make")) {
      document.getElementById("header-customer-make").textContent = "";
    }
  
    if (document.getElementById("header-order-date")) {
      document.getElementById("header-order-date").textContent = "";
    }
  
    // Similar for the main document fields
    if (document.getElementById("customer-country")) {
      document.getElementById("customer-country").textContent = "";
    }
    
    if (document.getElementById("customer-attention")) {
      document.getElementById("customer-attention").textContent = "";
    }
  
    if (document.getElementById("customer-vessel")) {
      document.getElementById("customer-vessel").textContent = "";
    }
  
    if (document.getElementById("customer-equipment")) {
      document.getElementById("customer-equipment").textContent = "";
    }
  
    if (document.getElementById("customer-make")) {
      document.getElementById("customer-make").textContent = "";
    }
  
    if (document.getElementById("order-date")) {
      document.getElementById("order-date").textContent = "";
    }
  
    // Populate items table if needed
    // The rest of the loading logic remains unchanged
  }
  
function downloadPDF() {
    // Show loading indicator and disable button
    const loadingIndicator = document.getElementById("loading");
    const downloadBtn = document.getElementById("downloadBtn");
    loadingIndicator.style.display = "block";
    downloadBtn.disabled = true;
  
    // Sync all data between main view and print header
    syncHeaderData();
  
    try {
      // Get the content to convert to PDF
      const element = document.querySelector(".content-wrapper");
  
      // PDF options
      const opt = {
        margin: 10,
        filename: "order-details.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      // Generate PDF
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          // Clean up
          loadingIndicator.style.display = "none";
          downloadBtn.disabled = false;
        })
        .catch((err) => {
          console.error("PDF generation failed:", err);
          loadingIndicator.style.display = "none";
          downloadBtn.disabled = false;
          alert("Failed to generate PDF. Please try again.");
        });
    } catch (err) {
      console.error("PDF generation error:", err);
      loadingIndicator.style.display = "none";
      downloadBtn.disabled = false;
      alert("Failed to generate PDF. Please try again.");
    }
  }
  
  // fetch data from api
document.addEventListener("DOMContentLoaded", function () {
    fetchData();
  });
  
function fetchData() {
    ZOHO.CREATOR.init().then(() => {
      console.log("Zoho Creator SDK initialized.");
      var queryparam = ZOHO.CREATOR.UTIL.getQueryParams();
      console.log(queryparam);
  
      var recordid = queryparam.RecID;
  

  
      var config = {
        appName: "",
        reportName: "All_Order_Acknowledgements",
        id: recordid,
      };
  
      ZOHO.CREATOR.API.getRecordById(config)
        .then(function (response) {
          console.log("Record Response:", response);
          const data = response.data;
          console.log("Data:", data);
  
          // Extract subform items data and map to expected format
          let itemsArray = [];
          if (data.SALES_CONFIRMATION && Array.isArray(data.SALES_CONFIRMATION)) {
            itemsArray = data.SALES_CONFIRMATION.map((item, index) => {
              const values = item.display_value.split("@");
              console.log("Values:", values);
              return {
                no: values[0],
                item:values[1],
                partNo: values[2] || "",
                qty: values[3] || "",
                unit: values[4] || "",
                unitPrice: values[5] || "",
                amount: values[6] || "",
                deliveryTime: values[7] || "",
                exWorks: values[8] || "",
                description: values[15],
                details : values[10]
              };
            });
          }
  
          // Create complete orderData object from API response
          const orderData = {
            customer: {
              company: data.Customer || "",
              attention: data.Attention || "",
             
              make: data.Make || "",
              type: data.Complete_Type || "",
            },
            order: {
              refNo: data.Our_Reference || "",
              date: data.Order_Date || "",
              trnNo: data.TRN_No || "",
              contact: data.Contact_Person || "",
              currency: data.Offer_Currency || "",
              page: "1 OF 1", // Will be updated when items are loaded
            },
            items: itemsArray,
            totals: {
             
              total: data.Total_Currency || "0.00",
              discount:data.Discount_Value || "0.00",
              amount:data.Total_Amount || "0.00",
            },
            terms: {
              source: data.Source_of_Supply || "",
              exWorks: data.Ex_Works || "",
              payment: data.Payment_Terms|| "",
              preparedBy: data.Prepared_By || "",
            },
          };
  
          // Populate form fields with the retrieved data
          console.log("order data is : ", orderData);
          console.log("items inside orderData is : ", orderData.items);
          populateFormFields(orderData);
          orderDataItems = orderData;
          
          // Also create the page preview
          setTimeout(createPagePreview, 200);
        })
        .catch(function (error) {
          console.error("Error fetching record:", error);
        });
    });
  }
  
  // Function to populate all form fields with the orderData
function populateFormFields(orderData) {
    // Populate customer details
    document.getElementById("customer-country").textContent =
      orderData.customer.company;
    document.getElementById("customer-attention").textContent =
      orderData.customer.attention;
    document.getElementById("customer-po").textContent =
      orderData.customer.customerNo;
    document.getElementById("customer-vessel").textContent =
      orderData.customer.vessel;
    document.getElementById("customer-equipment").textContent =
      orderData.customer.equipment;
    document.getElementById("customer-make").textContent =
      orderData.customer.make;
    document.getElementById("customer-type").textContent =
      orderData.customer.type;
  
    // Populate order details
    document.getElementById("order-ref").textContent = orderData.order.refNo;
    document.getElementById("order-date").textContent = orderData.order.date;
    document.getElementById("order-trn").textContent = orderData.order.trnNo;
    document.getElementById("order-contact").textContent =
      orderData.order.contact;
    document.getElementById("order-currency").textContent =
      orderData.order.currency;
     
  
    // Calculate total pages and items per page
    const itemsPerPage = 10;
    const totalItems = orderData.items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    // Update page numbers
    document.getElementById("order-page").textContent = `1 OF ${totalPages}`;
    const headerPageElement = document.getElementById("header-order-page");
    if (headerPageElement) {
      headerPageElement.textContent = `1 OF ${totalPages}`;
    }
  
    // Populate items table
    const tableBody = document.querySelector("#items-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    // Display all items with correct serial numbers
    orderData.items.forEach((item, index) => {
      const row = document.createElement("tr");
      
      // Create the item cell content with conditional rendering for description and details
      // Only add break tag when there's content to follow
      const description = item.description ? item.description.trim() : '';
      const details = item.details ? item.details.trim() : '';
      
      let descriptionHtml = '';
      if (description) {
        descriptionHtml = `<span style="color: #0072bc;">${description}</span>`;
        // Only add break if details exist
        if (details) {
          descriptionHtml += '<br/>';
        }
      }
      
      const detailsHtml = details ? `${details}` : '';
      
      row.innerHTML = `
            <td>${item.no}</td>
            <td style="text-align: left;">
              ${item.item}
              ${description || details ? '<br/>' : ''}
              ${descriptionHtml}
              ${details && !description ? '<br/>' + detailsHtml : detailsHtml}
            </td>
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.partNo}</td>
            <td>${item.qty}</td>
            <td>${item.unit}</td>
            <td>${formatCurrency(item.unitPrice)}</td>
            <td style="text-align: right;">${formatCurrency(item.amount)}</td>
            <td style="text-align: right;">${item.deliveryTime}</td>
            <td style="text-align: center;">${item.exWorks}</td>
        `;
      tableBody.appendChild(row);
    });
  
    // Add total rows
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="5" style="text-align: right !important;">Total</td>
        <td style="text-align: center !important;">${orderData.order.currency}</td>
        <td style="text-align: right;">${formatCurrency(orderData.totals.total)}</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      `;
    tableBody.appendChild(totalRow);
  
    const discountRow = document.createElement("tr");
    discountRow.innerHTML = `
        <td colspan="5" style="text-align: right; !important">Discount</td>
        <td  style="text-align: center !important;">${orderData.order.currency}</td>
        <td  style="text-align: right; !important ">${formatCurrency(orderData.totals.discount)}</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      `;
    tableBody.appendChild(discountRow);
  
    // const amountRow = document.createElement("tr");
    // amountRow.innerHTML = `      <td colspan="5" style="text-align:right;">Total:</td>
    //     <td style="text-align:center;">${orderData.order.currency}</td>
    //     <td style="text-align: right;">${orderData.totals.total}</td>
    //     <td>&nbsp;</td>
    //     <td>&nbsp;</td>
    //   `;
    // tableBody.appendChild(amountRow);/


    // Create a new table row element
const amountRow = document.createElement("tr");

// Set innerHTML with inline styles
amountRow.innerHTML = `
  <td colspan="5" style="text-align:right !important; vertical-align:top;">Amount:</td>
  <td style="text-align:center !important; ">${orderData.order.currency}</td>
  <td style="text-align:right !important;">${formatCurrency(orderData.totals.amount)}</td>
  <td>&nbsp;</td>
  <td>&nbsp;</td>
`;

// Append the row to an existing table body element
tableBody.appendChild(amountRow);

  
    // Populate terms
    document.querySelector(".sourceofsupply").textContent = orderData.terms.source;
    document.querySelector(".exworks").textContent =
      orderData.terms.exWorks;
    document.querySelector(".paymentterms").textContent =
      orderData.terms.payment;
    document.querySelector(".preparedby").textContent =
      orderData.terms.preparedBy;
    
    setTimeout(createPagePreview, 100);
}
  
  
  // Helper function to fetch image and convert to base64
async function imageToBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error fetching or converting image:', error);
        return null; // Return null if fetching fails
    }
}

async function downloadAsWord() {
    if (!orderDataItems || !orderDataItems.items || !Array.isArray(orderDataItems.items)) {
        console.error("Invalid order data for Word download", orderDataItems);
        alert("Error: Invalid data for Word download");
        return;
    }

    // Display loading indicator
    alert('Generating PDF for conversion. Please wait...');

    try {
        // 1. Generate PDF using the same logic as printPage but capture as blob instead of printing
        // Create a container for print content
        const printContainer = document.createElement('div');
        printContainer.id = 'print-container';
        printContainer.style.display = 'none';
        document.body.appendChild(printContainer);

        // Create a style element for print
        const printStyle = document.createElement('style');
        printStyle.id = 'print-style';
        printStyle.innerHTML = `
            #print-container {
                display: block !important;
            }
            
            .print-page {
                width: 100%;
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                page-break-after: always;
            }
            
            .print-page:last-child {
                page-break-after: auto;
            }
            
            .header-for-print {
                display: block !important;
                margin-bottom: 10px;
            }
            
            .company-info {
                color: #0072bc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .company-info h2 {
                color: #0072bc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .dual-tables {
                display: flex !important;
                justify-content: space-between !important;
                margin-bottom: 15px !important;
                gap: 15px !important;
            }
            
            /* Left-right tables for headers */
            .left-table, .right-table {
                display: none !important;
            }
            
            /* Strict table styling for consistent borders */
            .left-table-html, .right-table-html {
                width: 100% !important;
                border-collapse: collapse !important;
                border: 1px solid #000 !important;
               
                border-spacing: 0 !important;
                
            }
            
            .left-table-html {
                flex: 60 !important;
                width: 60% !important;
            }
            
            .right-table-html {
                flex: 40 !important;
                width: 40% !important;
            }
            
            .left-table-html th, .right-table-html th {
                background-color: #f0f0f0 !important;
                border: 1px solid #000 !important;
                padding: 6px 8px !important;
                font-size: 14px !important;
                font-weight: bold !important;
                text-align: center !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .left-table-html td, .right-table-html td {
                padding: 4px 8px !important;
                font-size: 10px !important;
                height: 24px !important;
                box-sizing: border-box !important;
                vertical-align: middle !important;
            }
            
             .right-table-html .label,
             .right-table-html .label-empty {
                width: 40% !important;
               
                background-color: #f9f9f9 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
              
            
            .left-table-html .value, .right-table-html .value,
            .left-table-html .value-empty, .right-table-html .value-empty {
                width: 60% !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }
            
            .empty-row td {
                background-color: #f9f9f9 !important;
            }
            
            .label-empty {
                border-right: none !important;
            }
            
            .value-empty {
                border-left: none !important;
            }
            
            .content-container {
                margin-top: 10px;
                display: block;
            }
            
            .main-table {
                border: 1px solid #000;
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
                margin-bottom: 10px;
                border-spacing: 0 !important;
            }
            
            .main-table thead {
                display: table-header-group;
            }
            
            /* Enforce consistent border for main table cells */
            .main-table th, .main-table td {
                border: 1px solid #000 !important;
                padding: 4px;
                font-size: 10px;
                vertical-align: middle;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .main-table th {
                background-color: #f0f0f0 !important;
                font-weight: bold;
            }
            
            /* Make sure total row text is right-aligned */
            .main-table tr:last-child td:first-child {
                text-align: right !important;
                font-weight: bold !important;
            }
            
            .footer-content {
                margin-top: 15px;
            }
            
            .delivery-note {
                color: #0072bc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin-top: 5px;
                margin-bottom: 5px;
            }
            
            .terms-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
                border-spacing: 0 !important;
                border: 1px solid black !important;
            }
            
            .terms-row {
                display: flex !important;
               
            }
            
            .terms-row:last-child {
                border-bottom: black !important;
            }
            
            .terms-cell {
                padding: 6px 8px !important;
                font-size: 10px !important;
               
                vertical-align: middle !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            // .terms-cell:last-child {
            //     border-right: black !important;
            // }
            
            .header-row .terms-cell {
                background-color: #f5f5f5 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-weight: 600 !important;
            }
            
            .note-section {
                font-size: 11px !important;
                line-height: 1.4 !important;
            }
            
            .note-section p {
                margin: 0 0 8px 0 !important;
            }
            
            .note-section ul {
                margin: 0 0 10px 0 !important;
                padding-left: 20px !important;
            }
            
            .note-section li {
                margin-bottom: 5px !important;
            }
            
            .red-text {
                color: red !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-weight: bold !important;
            }
          
        `;
        document.head.appendChild(printStyle);

        // Replicate the printPage logic
        const orderData = orderDataItems;
      
        const itemsPerPage = 19; // Use 19 items per page as requested
        const totalItems = orderData.items.length;
        const totalItemPages = Math.ceil(totalItems/ itemsPerPage);
        
        // Calculate if we need a separate page for the footer based on items on last page
        const itemsOnLastPage = totalItems % itemsPerPage || itemsPerPage;
        // If there are 5 or fewer items on the last page (including the 3 total rows),
        // we'll keep footer on same page, otherwise it gets its own page
        const footerOnSamePage = itemsOnLastPage <= 8;
        
        // Total pages depends on if footer needs its own page
        const totalPages = footerOnSamePage ? totalItemPages : totalItemPages + 1;
        
        // Sync header values before generating
        syncHeaderData();

        // Update the page count in the header
        document.getElementById("order-page").textContent = `1 OF ${totalPages}`;
        document.getElementById("header-order-page").textContent = `1 OF ${totalPages}`;

        // Create pages for items
        for (let page = 0; page < totalItemPages; page++) {
            const isLastItemPage = page === totalItemPages - 1;
            
            const pageDiv = document.createElement('div');
            pageDiv.className = 'print-page';
            
            // Add timestamp
           
            
            // Create header
            const headerSection = document.createElement('div');
            headerSection.className = 'header-for-print';
            headerSection.innerHTML = document.querySelector('.header-for-print').innerHTML;
          
            // Update page number
            const pageNumElement = headerSection.querySelector('#header-order-page');
            if (pageNumElement) {
                pageNumElement.textContent = `${page + 1} OF ${totalPages}`;
            }
            
            // Set date if empty
            const dateElement = headerSection.querySelector('#header-order-date');
            if (dateElement && (!dateElement.textContent || dateElement.textContent.trim() === "")) {
                dateElement.textContent = now.toLocaleDateString();
            }
            
            pageDiv.appendChild(headerSection);
            
            // Create content container for items
            const contentDiv = document.createElement('div');
            contentDiv.className = 'content-container';
            
            // Create items table
            const table = document.createElement('table');
            table.className = 'main-table';

            // Table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>No</th>
                    <th>Item</th>
                    <th>P/N</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                    <th style="text-align: right;">Delivery<br>Time</th>
                    <th style="text-align: right;">Ex-<br>Works</th>
                </tr>
            `;
            table.appendChild(thead);

            // Table body with items
            const tbody = document.createElement('tbody');
            const startIdx = page * itemsPerPage;
            const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

            for (let i = startIdx; i < endIdx; i++) {
                const item = orderData.items[i];
                if (!item) continue;
                
                // Create the item cell content with conditional rendering
                // Only add break tag when there's content to follow
                const description = item.description ? item.description.trim() : '';
                const details = item.details ? item.details.trim() : '';
                
                let descriptionHtml = '';
                if (description) {
                  descriptionHtml = `<span style="color: #0072bc;">${description}</span>`;
                  // Only add break if details exist
                  if (details) {
                    descriptionHtml += '<br/>';
                  }
                }
                
                const detailsHtml = details ? `${details}` : '';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.no || ''}</td>
                    <td style="text-align: left;">
                        ${item.item || ''}
                        ${description || details ? '<br/>' : ''}
                        ${descriptionHtml}
                        ${details && !description ? '<br/>' + detailsHtml : detailsHtml}
                    </td>
                    <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 10px;">${item.partNo || ''}</td>
                    <td>${item.qty || ''}</td>
                    <td>${item.unit || ''}</td>
                    <td>${formatCurrency(item.unitPrice) || ''}</td>
                    <td style="text-align: right;">${formatCurrency(item.amount) || ''}</td>
                    <td style="text-align: right;">${item.deliveryTime || ''}</td>
                    <td style="text-align: center;">${item.exWorks || ''}</td>
                `;
                tbody.appendChild(row);
            }
            
            // Add totals rows if this is the last page of items
            if (isLastItemPage) {
                const subtotalRow = document.createElement('tr');
                subtotalRow.innerHTML = `
                    <td colspan="5" style="text-align: right !important;">Total</td>
                    <td style="text-align: center !important;">${orderData.order.currency || ''}</td>
                    <td style="text-align: right !important;">${formatCurrency(orderData.totals.total) || ''}</td>
                    <td colspan="2"></td>
                `;
               tbody.appendChild(subtotalRow);

                const discountRow = document.createElement('tr');
                discountRow.innerHTML = `
                    <td colspan="5" style="text-align: right !important;">Discount</td>
                    <td style="text-align: center !important;">${orderData.order.currency || ''}</td>
                    <td style="text-align: right !important;">${formatCurrency(orderData.totals.discount) || ''}</td>
                    <td colspan="2"></td>
                `;
                tbody.appendChild(discountRow);
               

                const totalRow = document.createElement('tr');
                totalRow.innerHTML = `
                    <td colspan="5" style="text-align: right !important; font-weight: bold;">Total</td>
                    <td style="text-align: center !important; font-weight: bold;">${orderData.order.currency || ''}</td>
                    <td style="text-align: right !important; font-weight: bold;">${formatCurrency(orderData.totals.total) || ''}</td>
                    <td colspan="2"></td>
                `;
                tbody.appendChild(totalRow);
            }

            table.appendChild(tbody);
            contentDiv.appendChild(table);
            pageDiv.appendChild(contentDiv);

            // Only for the last item page - add footer content directly
            if (isLastItemPage && footerOnSamePage) {
                // Add footer content directly to the last item page
                const footerContent = document.createElement('div');
                footerContent.className = 'footer-content';
                
                // Add delivery note
                const deliveryNote = document.createElement('p');
                deliveryNote.className = 'delivery-note';
                deliveryNote.innerHTML = document.querySelector('.delivery-note').innerHTML;
                footerContent.appendChild(deliveryNote);
                
                // Add terms table
                const termsTable = document.querySelector('.terms-table').cloneNode(true);
                footerContent.appendChild(termsTable);
                
                // Add note section
                const noteSection = document.querySelector('.note-section').cloneNode(true);
                footerContent.appendChild(noteSection);
                
                pageDiv.appendChild(footerContent);
            }

            printContainer.appendChild(pageDiv);
        }

        // If we need a separate page for footer (too many items on last page)
        if (!footerOnSamePage) {
            const footerPage = document.createElement('div');
            footerPage.className = 'print-page';
            
            // Add timestamp
            
            
            // Create header for footer page
            const headerSection = document.createElement('div');
            headerSection.className = 'header-for-print';
            headerSection.innerHTML = document.querySelector('.header-for-print').innerHTML;
            
            // Update page number
            const pageNumElement = headerSection.querySelector('#header-order-page');
            if (pageNumElement) {
                pageNumElement.textContent = `${totalPages} OF ${totalPages}`;
            }
            
            footerPage.appendChild(headerSection);
            
            // Add footer content to separate page
            const footerContent = document.createElement('div');
            footerContent.className = 'footer-content';
            
            // Add delivery note
            const deliveryNote = document.createElement('p');
            deliveryNote.className = 'delivery-note';
            deliveryNote.innerHTML = document.querySelector('.delivery-note').innerHTML;
            footerContent.appendChild(deliveryNote);
            
            // Add terms table
            const termsTable = document.querySelector('.terms-table').cloneNode(true);
            footerContent.appendChild(termsTable);
            
            // Add note section
            const noteSection = document.querySelector('.note-section').cloneNode(true);
            footerContent.appendChild(noteSection);
            
            footerPage.appendChild(footerContent);
            printContainer.appendChild(footerPage);
        }
        
        // Make print container visible before generating PDF
        printContainer.style.display = 'block';
        
        console.log("Generating PDF blob using html2pdf...");
        const pdfOptions = {
            margin: 1,
            filename: 'quotation.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };
        
        // Generate PDF blob
        const pdfBlob = await html2pdf().from(printContainer).set(pdfOptions).outputPdf('blob');
        console.log("PDF blob generated successfully");
        
        // Clean up temporary elements
        printContainer.remove();
        printStyle.remove();

        // 2. Send PDF to ConvertAPI
        alert('PDF generated successfully. Sending to ConvertAPI...');
        const apiKey = 'secret_s4AkbPQnXKRiGKcG';
        const apiUrl = 'https://v2.convertapi.com/convert/pdf/to/docx';

        // Create FormData and append the PDF blob
        const formData = new FormData();
        formData.append('File', pdfBlob, 'quotation.pdf');
        
        // Send POST request to ConvertAPI
        const response = await fetch(`${apiUrl}?Secret=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`ConvertAPI request failed: ${response.status} ${response.statusText}`);
        }

        // Parse the JSON response
        const result = await response.json();
        console.log("ConvertAPI response:", result);

        // 3. Process the response and download the file
        if (result.Files && result.Files.length > 0 && result.Files[0].FileData) {
            const wordFileName = result.Files[0].FileName;
            const base64Data = result.Files[0].FileData;
            
            console.log("Processing FileData from ConvertAPI...");
            alert('Word document received. Processing for download...');

            // Convert base64 data to blob
            function base64ToBlob(base64, contentType) {
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                return new Blob([byteArray], {type: contentType});
            }

            const docxMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const docxBlob = base64ToBlob(base64Data, docxMimeType);
            
            // Save the file
            saveAs(docxBlob, wordFileName);
            alert('Word document download started!');
        } else {
            console.error("Invalid response from ConvertAPI:", result);
            throw new Error('ConvertAPI did not return expected file data');
        }
    } catch (error) {
        console.error("Error during PDF generation or conversion:", error);
        alert(`Failed to generate or convert document: ${error.message}`);
    }
}

window.downloadAsWord = downloadAsWord; // Ensure it's globally accessible
  
// Function to create A4 page previews
function createPagePreview() {
    console.log("Creating page preview...");
    
    // Get the container for the preview
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = ''; // Clear existing content
    
    // Get the original items
    const itemsTable = document.getElementById('items-table-body');
    if (!itemsTable) {
        console.error("Items table not found");
        return;
    }
    
    const items = Array.from(itemsTable.querySelectorAll('tr'));
    if (items.length === 0) {
        console.warn("No items found in the table");
    }
    
    // Format current date for timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    // Create the first page
    const firstPage = document.createElement('div');
    firstPage.className = 'page';
    
    // Add timestamp
    const timestampDiv = document.createElement('div');
  timestampDiv.className = 'timestamp';
  timestampDiv.style.color = "white";
    timestampDiv.textContent = `Generated: ${timestamp}`;
    firstPage.appendChild(timestampDiv);
    
    // Clone the header template
    const headerTemplate = document.getElementById('header-template');
    if (!headerTemplate) {
        console.error("Header template not found");
        return;
    }
    
    const headerForPage = headerTemplate.cloneNode(true);
    headerForPage.style.display = 'block';
    headerForPage.classList.add('header-for-print');
    headerForPage.id = 'page-1-header';
    
    // Update page number (will be updated again later)
    const totalPages = Math.ceil(items.length / 20); // Rough estimate to start
    const headerPageElement = headerForPage.querySelector('#header-order-page');
    if (headerPageElement) {
        headerPageElement.textContent = `1 OF ${totalPages}`;
    }
    
    firstPage.appendChild(headerForPage);
    
    // Create content for the page
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content-container';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'main-table';
    
    // Add table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>No</th>
            <th>Item</th>
            <th>P/N</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Unit Price</th>
            <th>Amount</th>
            <th style="text-align: right;">Delivery<br>Time</th>
            <th style="text-align: right;">Ex-<br>Works</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body for first page
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    contentDiv.appendChild(table);
    firstPage.appendChild(contentDiv);
    
    // Add the first page to the preview container
    previewContainer.appendChild(firstPage);
    
    // Create array to track pages
    const pages = [firstPage];
    const tableBodyElements = [tbody];
    
    // Get height measurements
    const headerHeight = headerForPage.offsetHeight + timestampDiv.offsetHeight;
    const rowHeight = 30; // Average row height in pixels (will be dynamically calculated)
    
    // Estimate available height for items
    // A4 is 297mm tall, minus margins and header
    const a4Height = 297; // mm
    const margins = 40; // mm (top + bottom)
    const availableHeight = a4Height - margins - (headerHeight / 4); // Approximate conversion to mm
    
    console.log(`Header height: ${headerHeight}px, Available height: ${availableHeight}mm`);
    
    // Function to calculate row height
    function getRowHeight(row) {
        const clone = row.cloneNode(true);
        clone.style.visibility = 'hidden';
        document.body.appendChild(clone);
        const height = clone.offsetHeight;
        document.body.removeChild(clone);
        return height;
    }
    
    // Track current page and height
    let currentPage = 0;
    let currentPageHeight = 0;
    const mmPerPixel = 0.26458333; // Rough conversion from pixels to mm
    
    // Add items dynamically to pages based on content height
    items.forEach((item, index) => {
        // Format monetary values in the item row before measuring
        const itemClone = item.cloneNode(true);
        const unitPriceCell = itemClone.querySelector('td:nth-child(6)');
        if (unitPriceCell) {
            unitPriceCell.textContent = formatCurrency(unitPriceCell.textContent);
        }
        
        const amountCell = itemClone.querySelector('td:nth-child(7)');
        if (amountCell) {
            amountCell.textContent = formatCurrency(amountCell.textContent);
        }
        
        // Ensure P/N column has proper styling
        const pnCell = itemClone.querySelector('td:nth-child(3)');
        if (pnCell) {
          pnCell.style.whiteSpace = 'normal';              // Allows wrapping
pnCell.style.overflowWrap = 'break-word';        // Modern word wrapping
pnCell.style.wordWrap = 'break-word';            // Legacy support
pnCell.style.textOverflow = 'ellipsis';          // Will not work unless white-space is nowrap and overflow is hidden
pnCell.style.fontSize = '10px';

           
        }
        
        const itemHeight = getRowHeight(itemClone) * mmPerPixel; // Convert to mm
        
        // Check if this item will fit on the current page
        if (currentPageHeight + itemHeight > availableHeight && index < items.length - 3) {
            // Need to create a new page
            currentPage++;
            currentPageHeight = 0;
            
            // Create a new page
            const newPage = document.createElement('div');
            newPage.className = 'page';
            
        
            
            // Clone header for new page
            const newHeaderForPage = headerTemplate.cloneNode(true);
            newHeaderForPage.style.display = 'block';
            newHeaderForPage.classList.add('header-for-print');
            newHeaderForPage.id = `page-${currentPage + 1}-header`;
            
            // Update page number (temporary)
            const pageNumElement = newHeaderForPage.querySelector('#header-order-page');
            if (pageNumElement) {
                pageNumElement.textContent = `${currentPage + 1} OF ${totalPages}`;
            }
            
            newPage.appendChild(newHeaderForPage);
            
            // Create content for the new page
            const newContentDiv = document.createElement('div');
            newContentDiv.className = 'content-container';
            
            // Create table
            const newTable = document.createElement('table');
            newTable.className = 'main-table';
            
            // Add table header
            const newThead = document.createElement('thead');
            newThead.innerHTML = thead.innerHTML;
            newTable.appendChild(newThead);
            
            // Create table body
            const newTbody = document.createElement('tbody');
            newTable.appendChild(newTbody);
            
            newContentDiv.appendChild(newTable);
            newPage.appendChild(newContentDiv);
            
            // Add the new page to the container
            previewContainer.appendChild(newPage);
            
            // Update page tracking
            pages.push(newPage);
            tableBodyElements.push(newTbody);
        }
        
        // Add the current item to the current page
        tableBodyElements[currentPage].appendChild(itemClone);
        
        // Update the current page height
        currentPageHeight += itemHeight;
    });
    
    // Get the footer content
    const footerTemplate = document.getElementById('footer-template');
    if (!footerTemplate) {
        console.error("Footer template not found");
        return;
    }
    
    const footerContent = footerTemplate.cloneNode(true);
    footerContent.style.display = 'block';
    footerContent.id = '';
    footerContent.className = 'footer-content';
    
    // Calculate footer height
    const tempFooter = footerContent.cloneNode(true);
    tempFooter.style.visibility = 'hidden';
    document.body.appendChild(tempFooter);
    const footerHeight = tempFooter.offsetHeight * mmPerPixel; // Convert to mm
    document.body.removeChild(tempFooter);
    
    // Check if footer can fit on the last page
    if (currentPageHeight + footerHeight > availableHeight) {
        // Create a new page for the footer
        currentPage++;
        
        // Create a footer page
        const footerPage = document.createElement('div');
        footerPage.className = 'footer-page';
        
       
        
        // Clone header for footer page
        const footerHeaderForPage = headerTemplate.cloneNode(true);
        footerHeaderForPage.style.display = 'block';
        footerHeaderForPage.classList.add('header-for-print');
        footerHeaderForPage.id = `page-${currentPage + 1}-header`;
        
        footerPage.appendChild(footerHeaderForPage);
        footerPage.appendChild(footerContent);
        
        // Add the footer page to the container
        previewContainer.appendChild(footerPage);
        
        // Update pages tracking
        pages.push(footerPage);
    } else {
        // Footer fits on the last page
        pages[currentPage].appendChild(footerContent);
    }
    
    // Update all page numbers now that we know the total
    const finalTotalPages = pages.length;
    pages.forEach((page, index) => {
        const pageNumElement = page.querySelector('#header-order-page');
        if (pageNumElement) {
            pageNumElement.textContent = `${index + 1} OF ${finalTotalPages}`;
        }
    });
    
    console.log(`Created ${finalTotalPages} pages in preview.`);
}

// Call our preview function when the page loads
document.addEventListener("DOMContentLoaded", function() {
    // First fetch data, then create the preview
    fetchData();
});

// Update populateFormFields to create the preview after populating data
const originalPopulateFormFields = populateFormFields;
populateFormFields = function(orderData) {
    // Call the original function
    originalPopulateFormFields(orderData);
    
    // Create the preview
    setTimeout(createPagePreview, 100); // Small delay to ensure DOM is updated
};
  
  
  
  
  
// Function to generate PDF directly from the page content
function printDirectToPDF() {
  // Show loading indicator
  alert("Generating PDF, please wait...");
  
  // Make sure data is populated and synced
  if (!orderDataItems || !orderDataItems.items || orderDataItems.items.length === 0) {
    console.error("No data available for PDF generation");
    alert("Error: No data available. Please wait for data to load.");
    return;
  }
  
  // Sync header data for consistency
  syncHeaderData();
  
  // First, ensure we have a good preview by calling createPagePreview
  createPagePreview();
  
  // Get the preview container that already has A4 formatted content
  const element = document.getElementById('preview-container');
  
  // If element is empty, alert and stop
  if (!element || element.children.length === 0) {
    console.error("Preview container is empty");
    alert("Error: Cannot generate PDF because the preview content is empty");
    return;
  }
  
  // Define PDF options specifically for A4 sizing
  const opt = {
    margin: [10, 10, 10, 15], // [top, right, bottom, left] in mm
    filename: "quotation.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true,
      allowTaint: true
    },
    jsPDF: { 
      unit: "mm", 
      format: "a4", 
      orientation: "portrait",
      compress: true 
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page:not(:first-child)', // Force page breaks between existing pages
    }
  };
  
  // Generate PDF with headers
  html2pdf()
    .from(element)
    .set(opt)
    .toPdf()
    .get('pdf')
    .then((pdf) => {
      // Add page numbers and headers to each page
      const totalPages = pdf.internal.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Add page number at the bottom
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
      }
      
      // Save the PDF with headers
      pdf.save("quotation.pdf");
      
      setTimeout(() => {
        alert("PDF generated successfully!");
      }, 1000);
    })
    .catch((err) => {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    });
}

// Make the function globally available
window.printDirectToPDF = printDirectToPDF;
  

  
  
  function downloadExcel() {
    try {
        const orderData = orderDataItems;
        console.log("Generating Excel file...", orderData);
        const workbook = XLSX.utils.book_new();

        // Combine header and items in one sheet
        const combinedData = [
            // Header Section
            ["MSC SHIP MANAGEMENT", "", "", "", "QUOTATION", "", "", "", ""],
            ["COUNTRY", orderData.customer.company || "-", "", "", "Our Ref", orderData.order.refNo || "-", "", "", ""],
            ["ATTN", orderData.customer.attention || "-", "", "", "DATE", orderData.order.date || "-", "", "", ""],
            ["CUSTOMER REF", orderData.customer.customerNo || "-", "", "", "TRN NO", orderData.order.trnNo || "-", "", "", ""],
            ["VESSEL", orderData.customer.vessel || "-", "", "", "OUR CONTACT", orderData.order.contact || "-", "", "", ""],
            ["EQUIPMENT", orderData.customer.equipment || "-", "", "", "CURRENCY", orderData.order.currency || "-", "", "", ""],
            ["MAKE", orderData.customer.make || "-", "", "", "PAGE", orderData.order.page || "-", "", "", ""],
            ["TYPE", orderData.customer.type || "-", "", "", "", "", "", "", ""],
            [], // Spacer row
            // Items Header
            ["No", "Item", "Part Number", "Qty", "Unit", "Unit Price", "Amount", "Delivery Time", "Ex-Works"]
        ];

        // Add items
        orderData.items.forEach(item => {
            const unitPrice = item.unitPrice ? parseFloat(item.unitPrice) : "";
            const amount = item.amount ? parseFloat(item.amount) : "";
            
            combinedData.push([
                item.no || "",
                item.item || "",
                item.partNo || "",
                item.qty || "",
                item.unit || "",
                unitPrice, // Excel will format numbers appropriately
                amount,    // Excel will format numbers appropriately
                item.deliveryTime || "",
                item.exWorks || ""
            ]);
        });

        // Add totals
        const total = orderData.totals.total ? parseFloat(orderData.totals.total) : 0;
        
        combinedData.push(
            [],
            ["", "", "", "", "Subtotal:", "", parseFloat(orderData.totals.subtotal || "0.00"), "", ""]
            ["", "", "", "", "Discount:", "", parseFloat(orderData.totals.discount || "0.00"), "", ""],
            ["", "", "", "", "Total", "", total, "", ""]
        );

        const worksheet = XLSX.utils.aoa_to_sheet(combinedData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 5 },  // No
            { wch: 30 }, // Item - reduced width to give more space to Part Number
            { wch: 20 }, // Part Number - increased width
            { wch: 8 },  // Qty
            { wch: 8 },  // Unit
            { wch: 12 }, // Unit Price
            { wch: 12 }, // Amount
            { wch: 15 }, // Delivery Time
            { wch: 12 }  // Ex-Works
        ];

        // Merge header cells
        worksheet["!merges"] = [
            // MSC SHIP MANAGEMENT merge (A1:E1)
            { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
            // QUOTATION merge (F1:J1)
            { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }
        ];
        
        // Format number cells with commas (Excel will handle this natively)
        // Excel will automatically format numbers when they are parsed as floats

        XLSX.utils.book_append_sheet(workbook, worksheet, "Quotation");
        
        // Generate Excel File
        const filename = `Quotation_${orderData.order.refNo}_${orderData.customer.company}.xlsx`;
        XLSX.writeFile(workbook, filename);

    } catch (error) {
        console.error("Excel export failed:", error);
        alert(`Error: ${error.message}`);
    }
}




