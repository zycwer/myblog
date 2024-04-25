// 赞赏按钮功能

function RewardButton(config) {
    this.btnIcon = config.btnIcon;
    this.btnText = config.btnText;
    this.comment = config.comment;
    this.qrcodes = config.qrcodes;
}

RewardButton.prototype = {
    init: function () {
        let btnId = "reward-btn";
        let qrcodesId = "reward-qrcodes";

        // 赞赏按钮
        var btn = document.createElement("button");
        btn.id = btnId;
        btn.type = "button";
        btn.innerHTML = `<i class="iconfont ${this.btnIcon}"></i><span>${this.btnText}</span>`;


        // 二维码容器
        var qrcodes = document.createElement("div");
        qrcodes.id = qrcodesId;

        // 按钮容器
        var div = document.createElement("div");
        div.id = "bottomBtn";
        div.style.textAlign = "center";
        div.appendChild(btn);
        div.innerHTML += `<br><br><span class="image-caption">${this.comment}</span>`;
        div.appendChild(qrcodes);

        // 将按钮容器插入在文章后面
        var postNav = document.querySelector(".post-prevnext");
        postNav.parentNode.insertBefore(div, postNav);

        // 按钮点击事件
        document.getElementById(btnId).onclick = function () {
            var container = document.getElementById(qrcodesId);

            if (container.childNodes.length == 0) {
                for (var i = 0; i < this.qrcodes.length; i++) {
                    var qrcode = document.createElement("p");
                    qrcode.className = "reward-qrcode";

                    var img = document.createElement("img");
                    img.src = this.qrcodes[i].src;
                    img.title = this.qrcodes[i].title;
                    img.alt = this.qrcodes[i].title;

                    var caption = document.createElement("p");
                    caption.className = "image-caption";
                    caption.innerText = this.qrcodes[i].caption;

                    qrcode.appendChild(img);
                    qrcode.appendChild(caption);
                    container.appendChild(qrcode);
                }
            } else if (container.style.display == "none") {
                container.style.removeProperty("display");
            } else {
                container.style.display = "none";
            }
        }.bind(this);


    },

};
