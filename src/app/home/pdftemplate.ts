export class PDFUtils2 {

 public static async getPdfTemplate(){
    return {
      pageSize: 'A4',
      content: [

        { text: 'DATTATRAY TOWER CO-OP HSG SOC LTD', style: 'header', alignment: 'center' },
        { text: [{ text: 'WATER BILL FOR THE MONTH OF ' }, { text: 'JUNE 2020 ', decoration: 'underline' },], style: 'subheader', alignment: 'center' },
        { text: [{ text: 'FLAT NO: ' }, { text: 'C-704 ', decoration: 'underline' },], style: 'subheader', alignment: 'center' },

        {
          style: 'tableExample',
          table: {
            widths: [150, '*', '*'],
            body: [
              ['', { text: 'KITCHEN', style: 'tableHeader', alignment: 'center' }, { text: 'TOILET', style: 'tableHeader', alignment: 'center' }],
              [{ text: 'APR END READING', alignment: 'center' }, { text: '21420', alignment: 'center' }, { text: '178818', alignment: 'center' }],
              [{ text: 'MAY END READING', alignment: 'center' }, { text: '21420', alignment: 'center' }, { text: '178818', alignment: 'center' }],
              [{ text: 'NET CONSUMPTION', style: 'tableHeader', alignment: 'center' }, { text: '3695 Ltrs', style: 'tableHeader', alignment: 'center' }, { text: '12971 Ltrs', style: 'tableHeader', alignment: 'center' }],
              [

                {
                  text: [

                    { text: '\n\n\nTotal Reading\n', bold: true, alignment: 'center', style: 'header' },
                    { text: '16666', bold: true, alignment: 'center' },
                    { text: '\n\n\nTOTAL BILL\n', bold: true, alignment: 'center', style: 'header' },
                    { text: '₹ 253', bold: true, alignment: 'center' }


                  ]
                },
                {
                  image: await PDFUtils2.getBase64ImageFromURL(
                    'http://localhost/_app_file_/storage/emulated/0/DTCHS/Images/A_G01/2020-7-1T.jpg'),
                  width: 180,
                  height: 180
                },
                {
                  image: await PDFUtils2.getBase64ImageFromURL(
                    'http://localhost/_app_file_/storage/emulated/0/DTCHS/Images/A_G01/2020-7-1T.jpg'),
                  width: 180,
                  height: 180
                },

              ],
              // [{ text: 'TOTAL BILL', style: 'tableHeader', alignment: 'center' }, { text: '₹ 253', style: 'tableHeader', alignment: 'center', colSpan: 2 }],
            ],
          }
        },
        '',

        {
          table: {
            style: 'line',
            widths: [530],
            body: [[{ text: 'SLAB 1:            0 - 13776 Ltrs | RATE: ₹ 0.01 / litre', style: 'slab', alignment: 'right' },], [{ text: 'SLAB 2:   13776 - 24278 Ltrs | RATE: ₹ 0.04 / litre', style: 'slab', alignment: 'right' },], [{ text: 'SLAB 3:    ABOVE 24278 Ltrs | RATE: ₹ 0.11 / litre', style: 'slab', alignment: 'right' },],]
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


      ],
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
