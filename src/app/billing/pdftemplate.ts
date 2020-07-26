export class PDFUtils {
  public static noImage;
  public static async getPdfTemplate(pdfObj, billData, index) {
    let img1,img2;
    try {
      img1 = await PDFUtils.getBase64ImageFromURL(billData.img1);
    } catch(err){
      img1 = PDFUtils.noImage;
    }
    try {
      img2 = await PDFUtils.getBase64ImageFromURL(billData.img2);
    } catch (err) {
      img2 = PDFUtils.noImage;
    }

    return [
      { text: 'DATTATRAY TOWER CO-OP HSG SOC LTD', style: 'header'+ (index%2==0?'':'2'), alignment: 'center' },
      { text: [{ text: 'WATER BILL FOR THE MONTH OF ' }, { text: pdfObj.month + ' ', decoration: 'underline' },], style: 'subheader', alignment: 'center' },
      { text: [{ text: 'FLAT NO: ' }, { text: billData.flat + ' ', decoration: 'underline' },], style: 'subheader', alignment: 'center' },
      {
        style: 'tableExample',
        table: {
          widths: [150, '*', '*'],
          body: [
            ['', { text: 'KITCHEN', style: 'tableHeader', alignment: 'center' }, { text: 'TOILET', style: 'tableHeader', alignment: 'center' }],
            [{ text: pdfObj.prevMonth + ' END READING', alignment: 'center' }, { text: billData.rpk, alignment: 'center' }, { text: billData.rpt, alignment: 'center' }],
            [{ text: pdfObj.currMonth + ' END READING', alignment: 'center' }, { text: billData.rck, alignment: 'center' }, { text: billData.rct, alignment: 'center' }],
            [{ text: 'NET CONSUMPTION', style: 'tableHeader', alignment: 'center' }, { text: billData.netk + ' Ltrs', style: 'tableHeader', alignment: 'center' }, { text: billData.nett + ' Ltrs', style: 'tableHeader', alignment: 'center' }],
            [
              {
                text: [

                  { text: '\n\n\nTotal Reading\n', bold: true, alignment: 'center', style: 'header' },
                  { text: billData.totalReading, bold: true, alignment: 'center' },
                  { text: '\n\n\nTOTAL BILL\n', bold: true, alignment: 'center', style: 'header' },
                  { text: '₹ ' + billData.total, bold: true, alignment: 'center' }


                ]
              },
              {
                image: img1,
                width: 180,
                height: 180
              },
              {
                image: img2,
                width: 180,
                height: 180
              },

            ],
          ],
        }
      },
      '  ',
      {
        table: {
          style: 'line',
          widths: [530],
          body: [[{ text: `SLAB 1:            0 - ${pdfObj.slab1} Ltrs | RATE: ₹ ${pdfObj.slab1Cost} / litre`, style: 'slab', alignment: 'right' },], [{ text: `SLAB 2:   ${pdfObj.slab1} - ${pdfObj.slab2} Ltrs | RATE: ₹ ${pdfObj.slab2Cost} / litre`, style: 'slab', alignment: 'right' },], [{ text: `SLAB 3:    ABOVE ${pdfObj.slab2} Ltrs | RATE: ₹ ${pdfObj.slab3Cost} / litre`, style: 'slab', alignment: 'right' },],]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0
          },
          vLineWidth: function (i, node) {
            return 0;
          },
        }
      },
      {
        table: {
          style: 'line',
          widths: [530],
          body: [[""]]
        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
        }
      },
    ]
  }

  public static async generatePdfObj(mainObj, pdfData) {
    PDFUtils.noImage = await PDFUtils.getBase64ImageFromURL('assets/noImageAvailable.jpg');
    let pdfTemplate = {
      pageSize: 'A4',
      content: [],
      styles: {
        slab: {
          fontSize: 8,
          bold: true,
          margin: [0, 0, 0, 0]
        },
        header: {
          fontSize: 12,
          bold: true,

        },
        header2: {
          fontSize: 12,
          bold: true,
          margin: [0, 20, 0, 0]

        },

        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 4, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        },
        tableExample: {
          fontSize: 10,
          margin: [0, 15, 0, 0]
        },
        line: {
          fontSize: 10,
          margin: [0, 0, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black'
        }
      }

    };

    for(let i=0; i < pdfData.length; i++){
      const flatContent = await PDFUtils.getPdfTemplate(mainObj, pdfData[i], i);
      pdfTemplate.content = pdfTemplate.content.concat(flatContent)
    }
    return pdfTemplate;

  }

  static getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
}
