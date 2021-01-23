export enum FanSections {
  Supply,
  Return,
  Coil,
  HeatRecovery,
  Filter,
  None
}
export const fetchReportFields = () => {
  return [
    {
      title: 'AHU - Quality Control Check Points',
      type: 'input',
      fields: [{
        type: 'input',
        label: 'Project: ',
        placeholder: 'Enter project name',
        store: 'project'
      },
      {
        type: 'input',
        label: 'Reference: ',
        placeholder: 'Enter reference',
        store: 'reference'
      },
        {
          type: 'date',
          label: 'Date: ',
          placeholder: 'Enter Date',
          store: 'date'
        },
      {
        type: 'input',
        label: 'Model: ',
        placeholder: 'Enter model',
        store: 'model'
      },
      {
        type: 'input',
        label: 'Go number: ',
        placeholder: 'Enter go number',
        store: 'gonumber'
      }, {
        type: 'input',
        label: 'Serial Number: ',
        placeholder: 'Enter serial number',
        store: 'serialno'
      }]

    }, {
      title: 'Fan section',
      type: 'radio',
      options: [
        {
          name: 'Supply',
          value: FanSections.Supply
        },
        {
          name: 'Return',
          value: FanSections.Return
        },
        {
          name: 'Coil',
          value: FanSections.Coil
        },
        {
          name: 'Heat Recovery',
          value: FanSections.HeatRecovery
        },
        {
          name: 'Filter',
          value: FanSections.Filter
        },
        {
          name: 'None',
          value: FanSections.None
        }

      ]
    }
  ];
}

export const fetchAccessories = () => {
  //no techincal need for id
  return [
    { label: "Microswitch", id: 0, isChecked: false },
    { label: "Electrical Gland", id: 1, isChecked: false },
    { label: "Internal Handles", id: 2, isChecked: false },
    { label: "Handle with lock", id: 3, isChecked: false },
    { label: "Inclined Manometer", id: 4, isChecked: false },
    { label: "Magnehelic Gauge [ D / W ]", id: 5, isChecked: false },
    { label: "Flatroof", id: 6, isChecked: false },
    { label: "Spigot :- Fan / Filter", id: 7, isChecked: false },
    { label: "Spare Filters", id: 8, isChecked: false },
    { label: "Spare Belts", id: 9, isChecked: false },
     { label: "Spare Motors", id: 10, isChecked: false },
     { label: "Drainable Floor", id: 11, isChecked: false },
     { label: "View Port", id: 12, isChecked: false },
     { label: "Light with wiring & Switch", id: 13, isChecked: false },
     { label: "Door Guard / Belt Guard", id: 14, isChecked: false },
     { label: "Floor Plate", id: 15, isChecked: false },
     { label: "Prob", id: 16, isChecked: false },
     { label: "Technical Room with :- EEV Kit - & Temperature Sensor", id: 17, isChecked: false },
     { label: "Temperature Sensor Gland", id: 18, isChecked: false },
     { label: "E - Coated Coil", id: 19, isChecked: false },
     { label: "New Gen.Heresite Coated Coil", id: 20, isChecked: false },
     { label: "Diffuser", id: 21, isChecked: false },
  ]
}
export const fetchPart1AParameters = () => {
  return [
    { id: 0, label: 'Outer Panel', val1: '', val2: '', op1: ['PPGI', 'SS 304', 'SS 316', 'Aluminium', 'add new...'], op2: ['0.6 mm', '0.8 mm', '1.0 mm', '1.2 mm', '1.5 mm', 'add new...']},
    {
      id: 1, label: 'Inner Panel', val1: '', val2: '', op1: ['GI', 'PPGI', 'SS 304', 'SS 316', 'Aluminium', 'add new...'], op2: ['0.6 mm', '0.8 mm', '1.0 mm', '1.2 mm', '1.5 mm', 'add new...']},
    {
      id: 2, label: 'Drain Pan', val1: '', val2: '', op1: ['GI', 'Coated GI', 'SS 304', 'SS 316', 'add new...'], op2: ['add new...']},
    { id: 3, label: 'Panel Fasteners', val1: '', val2: '', op1: ['GI', 'SS', 'add new...'], op2: ['add new...']},
    { id: 4, label: 'Roof', val1: '', val2: '', op1: ['PPGI', 'PP Alu.', 'add new...'], op2: ['add new...']},
  ]
}

export const fetchPart1BParameters = () => {
  return [
    { id: 0, label: 'TB Profile', val1: '', op1: ['TB3', 'TB2', 'add new...']},
    { id: 1, label: 'Insulation', val1: '', op1: ['PU', 'GW', 'add new...']},
    { id: 2, label: 'Inspection Side', val1: '', op1: ['RH', 'LH', 'add new...']},
    { id: 3, label: 'Header Side', val1: '', op1: ['RH', 'LH', 'add new...']},
    { id: 4, label: 'Synthetic Filter', val1: '', op1: ['G2', 'G3', 'G4', 'add new...']},
    { id: 5, label: 'Rigid Bag Filter', val1: '', op1: ['F7', 'F8', 'F9', 'add new...']},
    { id: 6, label: 'Loose Bag Fil.', val1: '', op1: ['F7', 'F8', 'F9', 'add new...']},
    { id: 7, label: 'Abs. Filter (Hepa)', val1: '', op1: ['H12', 'H13', 'H14', 'add new...']},

  ]
}

export const part2Parameters = () => {
  return [
    {
      label: "External Physical Dimension",
      method: "Measuring Tape(Executive Drawing)",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
      FanSections.None],
      isSelected: false,
      fields:[{label:'Size', value: ''}]
    },
    {
      label: "Corner Joints",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
        FanSections.None],
      isSelected: false,
    },
    {
      label: "Alu. Profile Joints and Sealants",
      method: "",
      inputs: [],
      typesOfSections: [],
      isSelected: false,
    }, 
    {
      label: "Fan Model and Orientation",
      method: "Visual, Tech. DS, Drawing",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
      fields: [{ label: 'Fan Model', value: '' }, { label: 'Fan Serial No', value: '' }, { label: 'Fan Curve', value: '' }, { label: 'Fan Make', value: '' }]
    },
    {
      label: "Calculated Fan Rpm ",
      method: "TDS",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Motor Model",
      method: "Visual, TDS",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
      fields:[{ label: 'Motor Power', value: '' }, { label: 'Motor Pole', value: '' }, { label: 'Motor Efficiency', value: '' }, { label: 'Motor Make', value: '' }, { label: 'Motor Serial No', value: '' }]
    },
    {
      label: "Pulleys Size",
      method: "Visual, TDS",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Transmission Alignment",
      method: "Laser alignment device / Striaght Edge",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Belt Deflection",
      method: "Manually / Tension Tester",
      inputs: [],
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Paint on Pulley & Bush",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Anti vibration Mount Position and Size",
      method: "Visual (Fan assembly Drawing)",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Flexible Connector and Gasket",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Section Joint Angle Position ",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
        FanSections.None],
      isSelected: false,
    },
    {
      label: "Fasteners Tightness Check",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
        FanSections.None],
      isSelected: false,
    },
    {
      label: "Rigging Hole Position and Marking",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
        FanSections.None],
      isSelected: false,
    },
    {
      label: "Name Plate Details",
      method: "Visual (Technical Data Sheet)",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
        FanSections.None],
      isSelected: false,
    },
    {
      label: "Jointing Kit Pack(bolt nut& gasket)",
      method: "Visual",
      typesOfSections: [FanSections.Supply],
      isSelected: false,
    },
    {
      label: "Panels free from dents and scratches ",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
      FanSections.HeatRecovery,
        FanSections.None],
      isSelected: false,
    },
    {
      label: "Shipment bracket",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
        FanSections.Return],
      isSelected: false,
    },
    {
      label: "Zinc Spray on Cut Edges",
      method: "Visual",
      typesOfSections: [FanSections.Supply,
      FanSections.Return,
      FanSections.Filter,
      FanSections.Coil,
        FanSections.HeatRecovery],
      isSelected: false,
      fields: [{ label: 'Heat Recovery Type', type:'list', options: [{label:'Thermal Wheel', isChecked: false}, {label:'HPHR', isChecked: false}, {label: 'Heat Pipe', isChecked: false}] }, { label: 'Heat Recovery Make', value: '' }, { label: 'Heat Recovery Model', value: '' }, { label: 'Heat Recovery Size', value: '' }]
    },
    {
      label: "Reinforcements for bag filter frame if Unit size above 14",
      method: "Visual",
      typesOfSections: [
        FanSections.Filter],
      isSelected: false,
    },
    {
      label: "Filter Clips , Strip",
      method: "Visual",
      typesOfSections: [
        FanSections.Filter],
      isSelected: false,
    },
    {
      label: "Bypass Gasket",
      method: "Visual",
      typesOfSections: [
        FanSections.Filter],
      isSelected: false,
      fields: [{ label: 'Damper Type', value: '' }, { label: 'Damper Size', value: '' }]
    },
    {
      label: "Drain Pan insulation / Sealant ",
      method: "",
      typesOfSections: [FanSections.Coil],
      isSelected: false,
    },
    {
      label: "Coil Inlet, Outlet,Drain Sticker",
      method: "",
      typesOfSections: [FanSections.Coil],
      isSelected: false,
      fields: [{ label: 'Coil Model', value: '' }, { label: 'Electric Heater Make', value: '' }, { label: 'Electric Heater Model', value: '' }, { label: 'Electric Heater Size', value: '' }, { label: 'UV Lamp Model', value: '' }, { label: 'UV Lamp Size', value: '' }, { label: 'UV Lamp Qty', value: '' }, { label: 'Elimiator Size', value: '' }, { label: 'Damper Type', value: '' }, { label: 'Damper Size', value: '' }]
    },
    {
      label: "Coil free from fin damages",
      method: "",
      typesOfSections: [],
      isSelected: false,
    }
  ]

}

export const filterDimensions = () => {
  return [
    {
      type: 'G2',
      isChecked: false,
      size: '592 x 592 x 48',
      qty: ''
    },
    {
      type: 'G3',
      isChecked: false,
      size: '592 x 28 x 48',
      qty: ''
    },
    {
      type: 'G4',
      isChecked: false,
      size: '',
      qty: ''
    },
    {
      type: 'RF7',
      isChecked: false,
      size: '592 x 592 x 282',
      qty: ''
    },
    {
      type: 'RF8',
      isChecked: false,
      size: '592 x 87 x 282',
      qty: ''
    },
    {
      type: 'RF9',
      isChecked: false,
      size: '',
      qty: ''
    },
    {
      type: 'LF7',
      isChecked: false,
      size: '592 x 592 x 535',
      qty: ''
    },
    {
      type: 'LF8',
      isChecked: false,
      size: '592 x 287 x 535',
      qty: ''
    },
    {
      type: 'LF9',
      isChecked: false,
      size: '',
      qty: ''
    }
  ]
} 