function LikeButton(config) {
    this.btnIcon = config.btnIcon;
    this.btnHoverIcon = config.btnHoverIcon
    this.btnText = config.btnText;
    this.server_url = config.serverURL;
}

LikeButton.prototype = {
    init: function () {
        var likeBtn = this;
        var btn = document.createElement("button");
        btn.id = "like-btn";
        btn.type = "button";
        btn.innerHTML = `<i class="iconfont ${this.btnIcon}"></i><span>${this.btnText}</span>`;
        var objid = null;
        editSpan();

        btn.addEventListener("click", function () {
            // 检查是否已经点过赞,点过忽略
            // var likeStatus = getCookie("likeStatus");
            // if (likeStatus === "liked") {
            //     console.log("您已经点过赞了！");
            //     return;
            // }

            // id 不为空的话，直接修改文本,否则创建对象
            var spanObj = document.querySelector("#like-btn span")
            if (objid) {
                spanObj.innerText = Number(spanObj.innerText) + 1;
                updatePost(objid, spanObj.innerText)
            } else {
                spanObj.innerText = 1;
                createPost()
            }
            // 设置1天cookie
            // setCookie("likeStatus", "liked", 1);

            //修改点赞状态
            try {
                var love_icon = document.querySelector("#like-btn i");
                if (love_icon) {
                    love_icon.classList.remove(likeBtn.btnIcon);
                    love_icon.classList.add(likeBtn.btnHoverIcon);
                }
            } catch (TypeError) {
                console.error("发生异常：", error);
            }
        })

        // 设置 cookie
        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = "; expires=" + date.toGMTString();
            }
            // 设置cookie的path为当前页面路径
            var path = window.location.pathname.replace(/\/[^\/]*$/, '');
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=" + path;
        }


        // 获取 cookie
        function getCookie(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
                if (cookie.indexOf(nameEQ) == 0) return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
            }
            return null;
        }

        function editSpan() {
            /* 
            检测对应网址是否有点赞对象
            有的话显示数量,拿取对应的objid,方便后续点赞操作
            没有的话显示配置文本
            */

            var url = `${likeBtn.server_url}/.netlify/functions/like_count/?action=check`;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    var targetObj = null;
                    // 检查所有target是否匹配当前页面
                    for (var i = 0; i < data.results.length; i++) {
                        var result = data.results[i];

                        // 数据库采用中文,这里也要解码成中文对比
                        if (result.target === decodeURIComponent(window.location.pathname)) {
                            targetObj = result;
                            break;
                        }
                    }
                    // 如果找到对应对象,显示对应数量；否则使用配置文本
                    if (targetObj) {
                        btn.querySelector("span").innerText = targetObj.count;
                        objid = targetObj.objectId
                    }
                }
            };
            xhr.send();
        }

        function createPost() {
            /* 创建对象 */
            var url = `${likeBtn.server_url}/.netlify/functions/like_count?action=create&pathname=${window.location.pathname}`;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    objid = JSON.parse(xhr.responseText).objectId
                    console.log(`点赞对象创建成功,${objid}`);
                }
            };
            xhr.send();
        }

        function updatePost(objectId, count) {
            /* 更新对象 */
            var url = `${likeBtn.server_url}/.netlify/functions/like_count?action=update&objectId=${objectId}&count=${count}`

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log('点赞+1');
                    // console.log(xhr.responseText)
                }
            };
            xhr.send();
        }

        // 插入在赞赏按钮后面
        var div = document.querySelector("#reward-btn");
        div.insertAdjacentElement("afterend", btn);
    },
};
