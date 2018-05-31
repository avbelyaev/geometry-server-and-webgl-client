/**
 * Created by anthony on 24.02.2018.
 */


class ModelSubmitter {
    constructor() {
        log(`constructing Model Submitter`);

        // const controlAdditionElem = document.getElementById(H2JS_CONTROL_ADDITION);
        this.modelSubmitterElement = document.getElementsByClassName(H2JS_CONTROL_ADDITION_FILE)[0];
        this.canBeSubmitted = true;
        this.canBePerformed = true;
    }

    static operations() {
        return [
            {
                id: "union",
                label: "Union"
            },
            {
                id: "intersection",
                label: "Intersection"
            },
            {
                id: "difference_ab",
                label: "Difference (a-b)"
            },
            {
                id: "difference_ba",
                label: "Difference (b-a)"
            }
        ];
    }

    addModelFromFile() {
        const file = this.modelSubmitterElement.files[0];
        const filename = file.name.includes('.')
            ? file.name.substr(0, file.name.indexOf('.'))
            : file.name;

        if (file && this.canBeSubmitted) {
            STLLoader.parseBinarySTL(file, (err, meshData) => {
                if (!err) {
                    log(`file ${filename} has been successfully parsed`);

                    const vertices = meshData.vertices;
                    console.log(vertices);

                    // const multiplyCoeff = 1000;
                    // log(`multiplying by ${multiplyCoeff}`);
                    // vertices.map(vertex => parseInt(vertex) * multiplyCoeff);

                    const mesh = new Figure(vertices, extendRandomColors(vertices), gl,
                        vsSource, fsSource, filename);
                    mesh.init();
                    figureController.addDynamicFigure(mesh);

                    log(`converting ${filename} to base64 and saving into local storage`);
                    ServerApiClient.convertToBase64(file, (err, res) => {
                        if (!err) {
                            localStorage.setItem(mesh.id, res);
                            log(`item ${mesh.id} has been saved`)
                        }
                    });


                } else {
                    log('file parse error: ' + err);
                }
                this.canBeSubmitted = true;
            });
            this.canBeSubmitted = false;

        } else {
            log('nothing to submit or already submitted');
        }
    }

    performBoolOp() {
        const stl1 = localStorage.getItem(idsOfFiguresToBeProcessed[0]);
        const stl2 = localStorage.getItem(idsOfFiguresToBeProcessed[1]);
        const cmd = Models.performOnStlModel('union', stl1, stl2);

        if (this.canBePerformed) {
            serverApiClient.performBoolOp(cmd, (err, res) => {
                if (!err) {
                    const data = res.data;
                    log(data);

                    const boolOpResult = Figure.ofInnerRepresentation(data, 'boolOpResult');
                    boolOpResult.init();
                    figureController.addDynamicFigure(boolOpResult);
                }
                this.canBePerformed = true;
            });
            this.canBePerformed = false;

        } else {
            log('nothing to perform already performed');
        }
    }
}
