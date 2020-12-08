//for open/closed hand
// I triened a model to detect the hand state using teachable machine of Google https://teachablemachine.withgoogle.com, also this link provide some code to how to work with your model.

    //video to be controlled
    var vid = document.getElementById("myideo"); 

    //funcions to pause or play video
    function playVid() { 
      vid.play(); 
    }  

    function pauseVid() { 
      vid.pause(); 
    } 

    //link of the trained model
    const URL = "https://teachablemachine.withgoogle.com/models/kSGspWbkB/";

    let model, webcam, labelContainer, maxPredictions;

    // initialzation for json data and trained model
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        //camera adjustmnets to get the video feedback
        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); //access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // put the camera with DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    }
    //webcam frame
    async function loop() {
        webcam.update(); 
        await predict();
        window.requestAnimationFrame(loop);
    }

    //prediction function
    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                console.log(prediction[0].probability.toFixed(2));
            // I trained two classes, open and closed
            //class 1 is open,so if the camera faced open hand, the
            //probaility will be more than .9
            //then play video
            if (prediction[0].probability.toFixed(2)>.33)
            {
                console.log("open");
                playVid();
                vid.play();
            }
            //class 2 is closed,so if the camera faced closed hand, the
            //probaility will be more than .9
            //then pause video
            if (prediction[1].probability.toFixed(2)>.9)
            {
                console.log("closed");
                pauseVid();
            }
            
        }
    }
