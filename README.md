# FaceEmotionApp

## How to use the app

1. Go to https://maximum-maximum.github.io/FaceEmotionApp/ .

2. Select the image for which you want to perform facial expression recognition (This step is not always necessary because the default image is already set).

3. Press the Face Detection button.

4. Place the cursor over the detected face area and click on it (At this time the face will not necessarily be detected).

5. Press the Predict button to see the results.

## How to set up

1. Install Docker

2. `git clone https://github.com/maximum-maximum/FaceEmotionApp.git`

3. `cd FaceEmotionApp`

4. `docker build .`

5. `docker run -p <optional port>:8888 -v ~/.../FaceEmotionApp/:/work --name <optional name> <IMAGE ID>`
