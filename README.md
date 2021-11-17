# FaceEmotionApp

Facial emotion recognition application using OpenCV and Tensorflow running in a web browser

## How to use the app

1. Go to https://maximum-maximum.github.io/FaceEmotionApp/ .

2. Select the image for which you want to perform facial expression recognition (This step is not always necessary because the default image is already set).

3. Press the Face Detection button to find a face in the image (At this time the face will not necessarily be detected).

4. Place the cursor over the detected face area and click on it .

5. Press the Predict button to see the results.

## How to set up

1. Install Docker

   - Mac: https://docs.docker.com/desktop/mac/install/
   - Windows: https://docs.docker.com/desktop/windows/install/

2. `git clone https://github.com/maximum-maximum/FaceEmotionApp.git`

3. `cd FaceEmotionApp`

4. `docker build .`

5. `docker run -p <OPTIONAL PORT>:8888 -v ~/<PATH>/FaceEmotionApp/:/work --name <OPTIONAL NAME> <IMAGE ID>`
