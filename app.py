from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import numpy as np
import cv2
from image_process import get_face_position, predict
from datetime import datetime
import os
import shutil
import string
import random

SAVE_DIR = "./images"
if not os.path.isdir(SAVE_DIR):
    os.mkdir(SAVE_DIR)

app = Flask(__name__, static_url_path="")


def random_str(n):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])


@app.route('/')
def index():
    return render_template('index.html', images=os.listdir(SAVE_DIR)[::-1])


@app.route('/images/<path:path>')
def send_js(path):
    return send_from_directory(SAVE_DIR, path)

# 参考: https://qiita.com/yuuuu3/items/6e4206fdc8c83747544b


@app.route('/upload', methods=['POST'])
def upload():
    if request.files['image']:
        # 画像として読み込み
        stream = request.files['image'].stream
        img_array = np.asarray(bytearray(stream.read()), dtype=np.uint8)
        img = cv2.imdecode(img_array, 1)

        # 変換
        face_box = get_face_position(img)

        # 保存
        for i in range(face_box.shape[0]):
            dt_now = datetime.now().strftime("%Y_%m_%d_%_H_%M_%S_") + random_str(3)
            save_path = os.path.join(SAVE_DIR, dt_now + ".png")

            candidate = img[face_box[i][1]:face_box[i][3], face_box[i][0]:face_box[i][2]]
            cv2.imwrite(save_path, candidate)

        print("save", save_path)

        return redirect('/')


@app.route('/select', methods=['POST'])
def select():
    result = predict(SAVE_DIR + "/" + request.form["select_face"])

    return render_template("result.html", img=SAVE_DIR + "/" + request.form["select_face"], result=result)


@app.route('/clear')
def clear():
    shutil.rmtree(SAVE_DIR)
    if not os.path.isdir(SAVE_DIR):
        os.mkdir(SAVE_DIR)
    return redirect('/')


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)

    # https://qiita.com/redshoga/items/60db7285a573a5e87eb6
