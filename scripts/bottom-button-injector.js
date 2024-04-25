hexo.extend.injector.register('body_end', function () {

    // 打赏按钮变量,解包操作
    const {
        reward_btn_icon,
        reward_btn_text,
        reward_btn_comment,
        qrcodes,
        reward_btn_enable
    } = hexo.config.bottom_btn.reward_btn || {};

    // 点赞按钮变量,解包操作
    const {
        like_btn_icon,
        like_hover_btn_icon,
        like_btn_text,
        like_btn_enable,
        serverUrl
    } = hexo.config.bottom_btn.like_btn || {};

    const enable = hexo.config.bottom_btn.enable

    if (!enable) {
        return null;
    }

    // 打赏按钮
    const rewardButtonScript = reward_btn_enable
        ? `<script src="/js/reward-button.js"></script>
      <script>
        new RewardButton({
          btnIcon: ${reward_btn_icon ? `"${reward_btn_icon}"` : "null"},
          btnText: "${reward_btn_text}",
          comment: "${reward_btn_comment}",
          qrcodes: ${JSON.stringify(qrcodes)}
        }).init();
      </script>`
        : "";


    // 点赞按钮
    const likeButtonScript = like_btn_enable
        ? `<script src="/js/like-button.js"></script>
        <script>
            new LikeButton({
                btnIcon: "${like_btn_icon}",
                btnHoverIcon: "${like_hover_btn_icon}",
                btnText: "${like_btn_text}",
                serverURL:"${serverUrl}"
            }).init();
        </script>`
        : "";

    return `
    <link defer rel="stylesheet" href="/css/ButtomBtn.css"/>
    ${rewardButtonScript}
    ${likeButtonScript}
    `;

}, "post");
