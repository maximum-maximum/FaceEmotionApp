import numpy as np
import cv2
from PIL import Image
from tensorflow.python.keras.models import load_model


def get_face_position(img):
    face_cascade_path = 'static/haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(face_cascade_path)

    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_box = face_cascade.detectMultiScale(img_gray)
    # face_box = face_cascade.detectMultiScale(img_gray, scaleFactor=1.05, minNeighbors=3, minSize=(120, 120))

    for i in range(face_box.shape[0]):
        face_box[i][2] += face_box[i][0]
        face_box[i][3] += face_box[i][1]

    return face_box


def analyze(img):
    emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

    gray = Image.open(img).convert('L')
    img_resize = gray.resize((48, 48))
    img = np.array(img_resize).reshape(1, 48, 48, 1)

    model = load_model('static/face_emotion.h5')
    pre = model.predict(img).reshape(7)
    arg = np.argsort(pre)[::-1]
    result = []
    for i in range(3):
        result.append('{}.{}: {}'.format(i + 1, emotions[arg[i]], pre[arg[i]]))
    return result
