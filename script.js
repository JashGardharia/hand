const URL = "./model/";

let model, webcam;
let previousGesture = "neutral";

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

    document
        .getElementById("webcam-container")
        .appendChild(webcam.canvas);

    requestAnimationFrame(loop);
}

async function loop() {

    webcam.update();

    const prediction =
        await model.predict(webcam.canvas);

    let best = prediction.reduce(
        (a, b) =>
        a.probability > b.probability
            ? a
            : b
    );

    document.getElementById("gesture")
        .innerText =
        "Detected: " +
        best.className +
        " (" +
        (best.probability * 100).toFixed(1) +
        "%)";

    if (best.probability > 0.95) {

        if (
            previousGesture === "neutral" &&
            best.className !== "neutral"
        ) {

            // PEACE = Scroll Up
            if (best.className === "peace") {

                window.scrollBy({
                    top: -500,
                    behavior: "smooth"
                });

                console.log("Scroll Up");
            }

            // THUMBS DOWN = Scroll Down
            if (best.className === "thumbs down") {

                window.scrollBy({
                    top: 500,
                    behavior: "smooth"
                });

                console.log("Scroll Down");
            }

            // FIVE = Go To Google
            if (best.className === "five") {

                console.log("Go Home");

                window.location.href =
                    "https://www.google.com";
            }
        }

        previousGesture = best.className;
    }

    requestAnimationFrame(loop);
}

init();
