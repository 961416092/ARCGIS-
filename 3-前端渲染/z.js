const renderer = {
    type: "class-breaks", // 相当于new ClassBreaksRenderer()
    field: "COL_DEG",
    normalizationTotal: 1500,
    defaultSymbol: {
        type: "simple-fill", // 相当于new SimpleFillSymbol()
        color: "black",
        style: "backward-diagonal",
        outline: {
            width: 0.5,
            color: [50, 50, 50, 0.6]
        }
    },
    defaultLabel: "no data",
    classBreakInfos: [
        {
            minValue: 0,
            maxValue: 50,
            symbol: less50,
            label: "< 50%"
        },
        {
            minValue: 50,
            maxValue: 100,
            symbol: more50,
            label: "> 50%"
        }
    ]
};