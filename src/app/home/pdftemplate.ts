import {FanSections} from './const';
export class PDFUtils {
  public static noImage: any;

  public static async getBase64ImageUrls(imagesArr: string[]) {
    const base64ImageUrls = [];
    for(let image of imagesArr) {
      base64ImageUrls.push(await PDFUtils.getBase64ImageFromURL(image));
    }
    return base64ImageUrls;
  }


  public static async generatePdfObj(pdfData:any) {
    PDFUtils.noImage = await PDFUtils.getBase64ImageFromURL('assets/icon.png');
    pdfData.images = await PDFUtils.getBase64ImageUrls(pdfData.images);
    const damperIndex = pdfData.fansection === 4 ? 22 : 24; // 4 is for Coil Fan Section 
    const damperField = pdfData.fansection === 4 ? 0 : 8;
    let pdfTemplate = {
      pageSize: 'A4',
      content: [

        {
          style: 'tableExample',
          color: 'black',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', '*'],
            headerRows: 2,
            body: [
              //row 1
              [{
                columns: [{
                  image: PDFUtils.noImage, width: 110, height: 25
                }, { text: '', width: "*" }, { text: '', width: "*" },
                { text: '', width: "*" }, { text: 'Mod. 76 - E\nRev.3 of 8-04-2020\nPage 1 of 2', width: "*", style: "headerinfo" }], colSpan: 5, alignment: 'left'
              }, {}, {}, {}, {}],
              //row 2
              [{ text: 'AHU - Quality Control Check Points', style: 'tableHeader', alignment: 'center', colSpan: 5 }, {}, {}, {}, {}],
              //row 3
              ['Project         ', '' + pdfData.project, { text: 'Model                ', width: "*", colSpan: 2 }, {}, '' + pdfData.model],
              //row 4
              ['Reference    ', '' + pdfData.reference, { text: 'Go Number       ', width: "*", colSpan: 2 }, {}, '' + pdfData.gonumber],
              //row 5
              ['Date              ', '' + pdfData.date, { text: 'Serial Number   ', width: "*", colSpan: 2 }, {}, '' + pdfData.serialno],
              [{ text: 'FAN SECTION -   ' + FanSections[pdfData.fansection], style: 'tableHeader', colSpan: 5 }, {}, {}, {}, {}],
              //row 6
              [{ text: 'PART - 1', style: 'tableHeader', alignment: 'center', colSpan: 5 }, {}, {}, {}, {}],
              //row 7
              [{ text: 'Parameter to Check', style: 'tableHeader', alignment: 'center' }, { text: 'Checking Method /\n Document', style: 'tableHeader', alignment: 'center' }, { text: 'Parameter to Check', style: 'tableHeader', alignment: 'center' }, { text: 'Document', style: 'tableHeader', alignment: 'center' }, { text: 'Remarks', style: 'tableHeader', alignment: 'center' }],
              //row 8
              [{
                style: 'tableExample',
                table: {
                  body: [
                    ['Component', 'MOC', 'THK'],
                    ['Outer Panel', pdfData['part1A'][0].val1, pdfData['part1A'][0].val2],
                    ['Inner Panel', pdfData['part1A'][1].val1, pdfData['part1A'][1].val2],
                    ['Drain Pan', pdfData['part1A'][2].val1, pdfData['part1A'][2].val2],
                    ['Panel Fasteners', pdfData['part1A'][3].val1, pdfData['part1A'][3].val2],
                    ['Roof', pdfData['part1A'][4].val1, pdfData['part1A'][4].val2],

                  ]
                }
              }, [{ text: `\n\n\n\n[ ${pdfData.doc1 === "0" ? '√' : ' '} ]  Order Execution`, style: 'subheader' }, { text: `\n\n[ ${pdfData.doc1 === "1" ? '√' : ' '}  ]  Data Sheet`, style: 'subheader' }], {
                style: 'tableExample',
                table: {
                  body: [
                    ['TB Profile', pdfData['part1B'][0].val1],
                    ['Insulation', pdfData['part1B'][1].val1],
                    ['Inspection Side', pdfData['part1B'][2].val1],
                    ['Header Side', pdfData['part1B'][3].val1],
                    ['Synthetic Filter', pdfData['part1B'][4].val1],
                    ['Rigid Bag Filter', pdfData['part1B'][5].val1],
                    ['Loose Bag Fil.', pdfData['part1B'][6].val1],
                    ['Abs. Filter (Hepa).', pdfData['part1B'][7].val1]
                  ]
                }
                }, [{ text: `\n\n\n\n[ ${pdfData.doc2 === "0" ? '√' : ' '} ]  Order Execution`, style: 'subheader' }, { text: `\n\n[ ${pdfData.doc2 === "1" ? '√' : ' '}  ]  Data Sheet`, style: 'subheader' }],
                'Some Random Remarks'],
              //row 9
              [{ text: 'PART - 2', style: 'tableHeader', alignment: 'center', colSpan: 5 }, {}, {}, {}, {}],
              //row 10
              [{ text: 'External Physical Dimension', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Measuring Tape (Executive Drawing)', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[0].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: 'Size: ' + pdfData.part2Parameters[0].fields[0].value }],
              //row 11
              [{ text: 'Corners Joints', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[1].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Model: ${pdfData.part2Parameters[3].fields[0].value} \n\nSerial No: ${pdfData.part2Parameters[3].fields[1].value}\n\nCurve: ${pdfData.part2Parameters[3].fields[2].value}\t\t\tMake:- ${pdfData.part2Parameters[3].fields[3].value}`, rowSpan: 3 }],
              //row 12
              [{ text: 'Fan Model and Orientation', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual (Tech. DS and Executive Drg.)', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[3].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 13
              [{ text: 'Calculated Fan Rpm', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Technical Data Sheet', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[4].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 14
              [{ text: 'Motor Model', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual (Technical DS)', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[5].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Kw: ${pdfData.part2Parameters[5].fields[0].value}\t\t Pole: ${pdfData.part2Parameters[5].fields[1].value}\t\t Effi: ${pdfData.part2Parameters[5].fields[2].value}\t\t Make:${pdfData.part2Parameters[5].fields[3].value}\t\t S.no ${pdfData.part2Parameters[5].fields[4].value}` }],
              //row 15
              [{ text: 'Pulleys Size', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual (Technical DS)', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[6].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
              {
                table: {
                  body: [
                    ['PH: __________', 'Sr No.: _______']
                  ]
                }
              }],
              //row 16
              [{ text: 'Transmission Alignment', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Laser alignment device / Straight Edge', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[7].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
              { text: 'F.Pulley : ____ \t\t\tM.Pulley: ____\n\n\nBelt: _____', rowSpan: 3 }],
              //row 17
              [{ text: 'Belt Deflection', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Manually / Tension Tester', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[8].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 18
              [{ text: 'Paint on Pulley & Bush', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[9].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 19
              [{ text: 'Anti vibration Mount Position and Size', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual (Fan assembly dwg.)', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[10].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Cooling Coil Model: ${pdfData.part2Parameters[24].fields[0].value} \n\n\nSno: _____`, rowSpan: 3 }],
              //row 20
              [{ text: 'Flexible Connector and Gasket', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[11].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 21
              [{ text: 'Section Joint Angle Position', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[12].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 22
              [{ text: 'Fasteners Tightness Check', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[13].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Damper Type: ${pdfData.part2Parameters[damperIndex].fields[damperField].value} \t\t Damper Size: ${pdfData.part2Parameters[damperIndex].fields[damperField + 1].value}`, rowSpan: 2 }],
              //row 23
              [{ text: 'Rigging Hole Position and Marking', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[14].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 24
              [{ text: 'Name Plate Details', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual (Technical DS)', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[15].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Heat Recovery Type :: \n\n[ ${pdfData.part2Parameters[19].fields[0].options[0].isChecked ? '√' : ' '}  ] Thermal Wheel\n[ ${pdfData.part2Parameters[19].fields[0].options[1].isChecked ? '√' : ' '}  ] HPHR\n [ ${pdfData.part2Parameters[19].fields[0].options[2].isChecked ? '√' : ' '}  ] Heat Pipe\n`, rowSpan: 2 }],
              //row 25
              [{ text: 'Jointing kit pack (Bolt,Nut & Gasket)', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[16].isSelected ? '√' : ' '}  ]`, alignment: 'center' }],
              //row 26
              [{ text: 'Panels free from dents and scratches', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual check', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[17].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Electrical Heater Make: ${pdfData.part2Parameters[24].fields[1].value}\t\t Electrical Heater Model: ${pdfData.part2Parameters[24].fields[2].value}\t\t Electrical Heater Size: ${pdfData.part2Parameters[24].fields[3].value}` }],
              //row 27
              [{ text: 'Shipment bracket', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual check', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[18].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `Eliminator Size: ${pdfData.part2Parameters[24].fields[7].value}` }],
              //row 28
              [{ text: 'Zinc spray on cut edges', colSpan: 2, alignment: 'center' },
              {},
              { text: 'Visual check', alignment: 'center' },
                { text: `[ ${pdfData.part2Parameters[19].isSelected ? '√' : ' '}  ]`, alignment: 'center' },
                { text: `UV Lamp Model: ${pdfData.part2Parameters[24].fields[4].value}\t\t UV Lamp Size: ${pdfData.part2Parameters[24].fields[5].value}\t\t UV Lamp Qty: ${pdfData.part2Parameters[24].fields[6].value}` }],
              //row 29
              [{ text: 'Filter Dimension :', alignment: 'center' },
              {
                table: {
                  body: [
                    ['Type', 'Size', 'Quantity'],
                    ['[_] G2', '592 x 592 x 48', ''],
                    ['[_] G3', '592 x 287 x 48', ''],
                    ['[_] G4', '', ''],
                  ]
                }
              },
              {
                table: {
                  body: [
                    ['Type', 'Size', 'Quantity'],
                    ['[_] RF7', '592 x 592 x 282', ''],
                    ['[_] RF8', '592 x 287 x 282', ''],
                    ['[_] RF9', '', ''],
                  ]
                }, colSpan: 2
              },
              {},
              {
                table: {
                  body: [
                    ['Type', 'Size', 'Quantity'],
                    ['[_] LF7', '592 x 592 x 535', ''],
                    ['[_] LF8', '592 x 287 x 535', ''],
                    ['[_] LF9', '', ''],
                  ]
                }
              },
              ],
              //row 30
              [{ text: 'Accessories', style: 'tableHeader', alignment: 'center', colSpan: 5 }, {}, {}, {}, {}],
              //row 29
              [{
                table: {
                  body: [
                    [`[${pdfData.accessories[0].isChecked ? '√' : '  '}] ${pdfData.accessories[0].label}`],
                    [`[${pdfData.accessories[1].isChecked ? '√' : '  '}] ${pdfData.accessories[1].label}`],
                    [`[${pdfData.accessories[2].isChecked ? '√' : '  '}] ${pdfData.accessories[2].label}`],
                    [`[${pdfData.accessories[3].isChecked ? '√' : '  '}] ${pdfData.accessories[3].label}`],
                    [`[${pdfData.accessories[4].isChecked ? '√' : '  '}] ${pdfData.accessories[4].label}`],
                    [`[${pdfData.accessories[5].isChecked ? '√' : '  '}] ${pdfData.accessories[5].label}`],
                  ]
                }
              },
              {
                table: {
                  body: [
                    [`[${pdfData.accessories[7].isChecked ? '√' : '  '}] ${pdfData.accessories[7].label}`],
                    [`[${pdfData.accessories[8].isChecked ? '√' : '  '}] ${pdfData.accessories[8].label}`],
                    [`[${pdfData.accessories[9].isChecked ? '√' : '  '}] ${pdfData.accessories[9].label}`],
                    [`[${pdfData.accessories[10].isChecked ? '√' : '  '}] ${pdfData.accessories[10].label}`],
                    [`[${pdfData.accessories[11].isChecked ? '√' : '  '}] ${pdfData.accessories[11].label}`],
                    [`[${pdfData.accessories[12].isChecked ? '√' : '  '}] ${pdfData.accessories[12].label}`],
                  ]
                }
              },
              {
                table: {
                  body: [
                    [`[${pdfData.accessories[13].isChecked ? '√' : '  '}] ${pdfData.accessories[13].label}`],
                    [`[${pdfData.accessories[14].isChecked ? '√' : '  '}] ${pdfData.accessories[14].label}`],
                    [`[${pdfData.accessories[15].isChecked ? '√' : '  '}] ${pdfData.accessories[15].label}`],
                    [`[${pdfData.accessories[16].isChecked ? '√' : '  '}] ${pdfData.accessories[16].label}`],
                    [`[${pdfData.accessories[17].isChecked ? '√' : '  '}] ${pdfData.accessories[17].label}`],
                    [`[${pdfData.accessories[18].isChecked ? '√' : '  '}] ${pdfData.accessories[18].label}`],
                  ]
                }, colSpan: 2
              },
              {},
              {
                table: {
                  body: [
                    [`[${pdfData.accessories[19].isChecked ? '√' : '  '}] ${pdfData.accessories[19].label}`],
                    [`[${pdfData.accessories[20].isChecked ? '√' : '  '}] ${pdfData.accessories[20].label}`],
                    [`[${pdfData.accessories[21].isChecked ? '√' : '  '}] ${pdfData.accessories[21].label}`],
                    [`[  ]   `],
                    [`[  ]   `], [`[  ]   `]
                  ]
                }
              },
              ],
              //row 32
              [{ text: `QC Checked By: ${pdfData.QCCheckedBy}  \t\t\t\t\tDate - ${pdfData.QCDate}`, style: 'tableHeader', colSpan: 2 },
              {},
                { text: `Assembled By: ${pdfData.AssembledBy}  \t\t\t\t\tDate - ${pdfData.AssembleDate}`, style: 'tableHeader', colSpan: 3 },
              {}, {}],

            ]
          }
        },
        {
          text: `\nTime End : ${pdfData.TimeEnd}`,
          alignment: 'right'
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'RATING', alignment: 'center',
            },
            {
              text: ''
            }
          ]
        },
        {
          alignment: 'justify',
          columns: [
            {
              table: {
                body: [
                  [' A ', ' B ', ' C ', ' D '],
                  [pdfData.rating === 'A' ? ' √ ' : '  ',
                   pdfData.rating === 'B' ? ' √ ' : '  ',
                   pdfData.rating === 'C' ? ' √ ' : '  ',
                   pdfData.rating === 'D' ? ' √ ' : '  '],

                ]
              }
            },
            {
              table: {
                body: [
                  [' QC Passed ', pdfData.QCStatus === "1" ? ' [   √   ] ' : ' [_____] '],
                  [' QC Failed ', pdfData.QCStatus === "0" ? ' [   √   ] ' : ' [_____] '],

                ]
              }
            },
          ]
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: '\nA - GOOD ; B - MINOR COMMENTS ; C - MAJOR COMMENTS ; D - Rejected', alignment: 'left',
            },
            {
              text: ''
            }
          ]
        },
        //page 2
        {
          text: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'
        },


        {
          style: 'tableExample',
          color: 'black',
          table: {
            widths: ['auto', 'auto'],
            headerRows: 2,
            body: [
              //row 1
              [{
                columns: [{
                  image: PDFUtils.noImage, width: 110, height: 25
                }, { text: '', width: 200 }, { text: '', width: '*' },
                { text: '', width: "*" }, { text: 'Mod. 76 - E\nRev.3 of 8-04-2020\nPage 2 of 2', width: "*", style: "headerinfo" }], colSpan: 2, alignment: 'left'
              }, {}],
              //row 2
              [{ colSpan: 2, text: ' \n\n\n  ' }, {}],
              [{
                image: pdfData.images[0],
                width: 200,
                height: 200,
                alignment: 'center'
              }, {
                  image: pdfData.images[1],
                width: 200,
                height: 200,
                alignment: 'center'
              },],
              //row 2
              [{
                image: pdfData.images[2],
                width: 200,
                height: 200,
                alignment: 'center'
              }, {
                  image: pdfData.images[3],
                width: 200,
                height: 200,
                alignment: 'center'
              },],	//row 3
              [{
                image: pdfData.images[4],
                width: 200,
                height: 200,
                alignment: 'center'
              }, {
                  image: pdfData.images[5],
                width: 200,
                height: 200,
                alignment: 'center'
              },],
            ]
          }
        },

      ],
      styles: {
        mainTable: {
          margin: [0, 0, 0, 0],
          fontSize: 12,
        },
        headerinfo: {
          fontSize: 4,
          bold: true
        },
      },
      defaultStyle: {
        margin: [0, 0, 0, 0],
        fontSize: 5,
        columnGap: 20
      }

    };


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
