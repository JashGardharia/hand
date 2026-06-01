const URL = "./model/";

let model;
let webcam;

let lastGesture = "";

async function init() {

    model = await tmImage.load(
        URL + "model.json",
        URL + "metadata.json"
    );

    webcam = new tmImage.Webcam(
        300,
        300,
        true
    );

    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam")
        .srcObject = webcam.webcam.srcObject;

    requestAnimationFrame(loop);
}

async function loop() {

    webcam.update();

    const prediction =
        await model.predict(webcam.canvas);

    let best = prediction.reduce(
        (a,b)=>
        a.probability > b.probability
        ? a : b
    );

    if(
        best.probability > 0.95 &&
        best.className !== lastGesture
    ){

        lastGesture = best.className;

        console.log(best.className);

        if(best.className === "Peace"){

            window.scrollBy({
                top:-500,
                behavior:"smooth"
            });
        }

        if(best.className === "ThumbsDown"){

            window.scrollBy({
                top:500,
                behavior:"smooth"
            });
        }

        if(best.className === "Palm"){

    window.location.href = "https://www.google.com";
}
    }

    requestAnimationFrame(loop);
}

init();
