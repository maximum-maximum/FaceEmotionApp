const srcImg = document.getElementById('src-image');
const hiddenImg = document.getElementById('hidden-image');
const fileInput = document.getElementById('input-file');
const canvas = document.getElementById('dest-canvas');
const hiddenCanvas = document.getElementById('hidden-canvas');
const grayScaleBtn = document.getElementById('gray-scale-btn');
const lineDrawBtn = document.getElementById('linedraw-btn');
const downloadBtn = document.getElementById('download-btn');
const findFaceBtn = document.getElementById('findface-btn');
const predictBtn = document.getElementById('predict-btn');


function convertImageToGray(img) {
    let dst = new cv.Mat();
    cv.cvtColor(img, dst, cv.COLOR_RGBA2GRAY, 0);
    return dst;
}

function convertImageToLineDrawing(img) {
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));

    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

    const imgDilated = new cv.Mat();
    cv.dilate(imgGray, imgDilated, kernel, new cv.Point(-1, 1), 1);

    const imgDiff = new cv.Mat();
    cv.absdiff(imgDilated, imgGray, imgDiff);

    const contour = new cv.Mat();
    cv.bitwise_not(imgDiff, contour);
    return contour;
}

function dataUriToBlob(dataUri) {
    const b64 = atob(dataUri.split(',')[1]);
    const u8 = Uint8Array.from(b64.split(''), e => e.charCodeAt());
    return new Blob([u8], {type: 'image/png'});
}

function indexAdjust(x, dim) {
    if (x >= 0) {
        return x;
    } else {
        return dim;
    }
}

fileInput.addEventListener('change', e => {
    srcImg.src = URL.createObjectURL(e.target.files[0]);
    hiddenImg.src = URL.createObjectURL(e.target.files[0]);
}, false);

grayScaleBtn.addEventListener('click', e => {
    let src = cv.imread(srcImg);
    const dst = convertImageToGray(src);
    cv.imshow('dest-canvas', dst);
    src.delete();
    dst.delete();

    let hiddenSrc = cv.imread(hiddenImg);
    const hiddenDst = convertImageToGray(hiddenSrc);
    cv.imshow('hidden-canvas', hiddenDst);
    hiddenSrc.delete();
    hiddenDst.delete();
});

lineDrawBtn.addEventListener('click', e => {
    const src = cv.imread(srcImg);
    const dst = convertImageToLineDrawing(src);
    cv.imshow('dest-canvas', dst);
    src.delete();
    dst.delete();

    const hiddenSrc = cv.imread(hiddenImg);
    const hiddenDst = convertImageToLineDrawing(hiddenSrc);
    cv.imshow('hidden-canvas', hiddenDst);
    hiddenSrc.delete();
    hiddenDst.delete();
});

downloadBtn.addEventListener('click', e => {
    const data = hiddenCanvas.toDataURL();
    const url = URL.createObjectURL(dataUriToBlob(data));
    downloadBtn.href = url;
});

findFaceBtn.addEventListener('click', e => {
    const utils = new Utils('errorMessage');
    const faceCascadeFile = 'haarcascade_frontalface_default.xml'; 
    utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        let src = cv.imread(srcImg);
        let gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        let faces = new cv.RectVector();
        let faceCascade = new cv.CascadeClassifier();
        faceCascade.load(faceCascadeFile); 
        let msize = new cv.Size(0, 0);
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize); 
        
        for (let i = 0; i < faces.size(); ++i) {
            let roiGray = gray.roi(faces.get(i));
            let roiSrc = src.roi(faces.get(i));
            let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
            let point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
            cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
            roiGray.delete(); 
            roiSrc.delete();
        }

        cv.imshow('dest-canvas', src);
        // src.delete();
        gray.delete();

        var continuous = false;
        var isInArea = false;
        var targetId = null;
        var ctx = canvas.getContext('2d');

        // 初期値 
        ctx.rect(0, 0, 0, 0);

        canvas.addEventListener('mousemove', e => {
            for (let i = 0; i < faces.size(); ++i) {
                if (ctx.isPointInPath(e.offsetX, e.offsetY)) {
                    if (!continuous) {
                        ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
                        ctx.fill();
                        targetId = indexAdjust(i-1, faces.size()-1);
                    }
                    continuous = true;
                    isInArea = true;
                }
                else {
                    continuous = false;
                    isInArea = false;
                    cv.imshow('dest-canvas', src);
                    // src.delete();
                    ctx.rect(faces.get(i).x, faces.get(i).y, faces.get(i).width, faces.get(i).height);
                } 
            }
        });

        canvas.addEventListener('click', e => {
            if (targetId != null && isInArea) {
                let dst = new cv.Mat();
                let rect = new cv.Rect(faces.get(targetId).x, faces.get(targetId).y, faces.get(targetId).width, faces.get(targetId).height);
                dst = cv.imread(srcImg).roi(rect);
                cv.imshow('face-canvas', dst);
                // dst.delete();
            }
        });
    });   
});

predictBtn.addEventListener('click', e => {
    const emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
    
    tf.loadLayersModel('model/model.json').then(model => {
        const MODEL_HEIGHT = model.input.shape[1];
        const MODEL_WIDTH = model.input.shape[2];

        /* Read image and convert into tensor */
        const img_org = document.getElementById('face-canvas');
        let inputTensor = tf.browser.fromPixels(img_org, 3);  // get rgb (without alpha)

        /* Resize to model input size (28x28) */
        inputTensor = inputTensor.resizeBilinear([MODEL_HEIGHT, MODEL_WIDTH])

        /* Convert to grayscale (keep dimension(HWC))*/
        inputTensor = inputTensor.mean(2, true);

        /* Reverse black and white */
        inputTensor = tf.sub(255, inputTensor);  

        /* 0.0 - 1.0 */
        inputTensor = inputTensor.cast("float32").div(tf.scalar(255));

        /* expand dimension (HWC ->  NHWC) */
        inputTensor = inputTensor.expandDims();

        /* Inference */
        const accuracyScores = model.predict(inputTensor).dataSync();
        for (let i = 0; i < emotions.length; ++i) {
            console.log(emotions[i] + ': ' + accuracyScores[i]);
        }

        const maxAccuracyIndex = accuracyScores.indexOf(Math.max.apply(null, accuracyScores));
        console.log(maxAccuracyIndex);

        const elements = document.querySelectorAll(".accuracy");
        elements.forEach(el => {
            el.parentNode.classList.remove('is-selected');
            const rowIndex = Number(el.dataset.rowIndex);
            if (maxAccuracyIndex === rowIndex) {
            el.parentNode.classList.add('is-selected');
            }
            el.innerText = String(accuracyScores[rowIndex]).slice(0, 8);
        })

    });
});