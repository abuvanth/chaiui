!function (bs, chai) {
    chai.createAlert = function (title, msg) {
        var obj = {};
        var wind = document.createElement("div");
        var overlay = document.createElement("div");
        var btn = document.createElement("button");

        bs.select(btn).css({
            margin: "8px 8px 8px 0",
            float: "right",
            fontSize: "14px",
            minWidth: "0"
        });

        btn.setAttribute("class", "chai button flat primary");
        btn.innerHTML = "Ok";

        obj.okBtn = btn;

        overlay.setAttribute("class", "overlay");
        bs.select(wind).css({
            position: "fixed",
            zIndex: "999",
            top: "40%",
            opacity: "0",
            left: "50%",
            visibility: "hidden",
            transform: "translate(-50%, -50%)",
            paddingTop: "22px",
            width: "270px",
            maxWidth: "95%",
            backgroundColor: "#FFF",
            borderRadius: "2px",
            transition: "all .2s ease-in-out",
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px"
        });
        var title_element = document.createElement("div");
        bs.select(title_element).css({
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "20px",
            fontWeight: "500"
        });
        title_element.innerHTML = title;
        var msg_element = document.createElement("div");
        bs.select(msg_element).css({
            fontSize: "16px",
            paddingLeft: "24px",
            paddingRight: "24px",
            marginTop: "24px",
            marginBottom: "10px",
            color: "#555",
            maxHeight: "200px",
            overflow: "auto"
        });

        msg_element.innerHTML = msg;
        document.body.appendChild(overlay);
        wind.appendChild(title_element);
        wind.appendChild(msg_element);
        wind.appendChild(btn);

        obj.wind = wind;

        document.body.appendChild(wind);
        bs.select(overlay).css({
            opacity: "0",
            visibility: "hidden"
        });

        obj.show = function () {
            bs.select(wind).css({
                opacity: "1",
                visibility: "visible",
                top: "50%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "1",
                visibility: "visible",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        obj.hide = function () {
            bs.select(wind).css({
                opacity: "0",
                visibility: "hidden",
                top: "40%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "0",
                visibility: "hidden",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        btn.addEventListener("click", obj.hide, false);
        return obj;
    };

    chai.createConfirm = function (title, msg) {
        var wind = chai.createAlert(title, msg);
        var cancel = document.createElement("button");
        bs.select(cancel).css({
            margin: "8px 8px 8px 0",
            float: "right",
            fontSize: "14px",
            minWidth: "0"
        });
        cancel.innerHTML = "cancel";
        cancel.setAttribute("class", "chai button flat");
        wind.wind.appendChild(cancel);

        wind.onSuccess = function (callback) {
            wind.okBtn.addEventListener("click", callback, false);
        };
        wind.onFail = function (callback) {
            cancel.addEventListener("click", function () {
                wind.hide();
                callback();
            }, false);
        };

        return wind;
    };

    chai.createDialog = function (el) {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);
        console.log(overlay);
        bs.select(el).css({
            opacity: "0",
            visibility: "hidden",
            top: "40%"
        });

        var obj = {};
        obj.show = function () {
            bs.select(el).css({
                opacity: "1",
                visibility: "visible",
                top: "50%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "1",
                visibility: "visible",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        obj.hide = function () {
            bs.select(el).css({
                opacity: "0",
                visibility: "hidden",
                top: "40%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "0",
                visibility: "hidden",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        obj.onOverlayClick = function (callback) {
            overlay.addEventListener("click", callback, false);
        };

        return obj;
    }
}(bs, chai);