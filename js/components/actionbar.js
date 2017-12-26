!function (bs, chai) {
    function addTouchGestures (el) {
        el = bs.select(el);
        var obj = {};
        obj.overlay = el.children().find(".overlay").get();
        el = el.get();

        var hammer = new Hammer(el);
        obj.width = 280;
        obj.stage = obj.width;

        hammer.on("panstart", function() {
            obj.overlay.style.visibility = "visible";
        });
        hammer.on("panstart panmove", function(e) {
            obj.overlay.style.opacity = ((el.offsetLeft + obj.width) / obj.width) * 0.5 + "";

            if (e.deltaX <= obj.width) {
                if (obj.stage === 0) {
                    if (e.deltaX <= 0) {
                        el.style.left = e.deltaX - obj.stage + "px";
                    }
                } else {
                    el.style.left = e.deltaX - obj.stage + "px";
                }
            } else {
                el.style.left = "0";
            }
        });

        hammer.on("panend", function(e) {
            console.log(el.offsetLeft);
            if (e.deltaX >= 0) {
                if (e.deltaX < obj.width / 2) {
                    if (obj.stage !== 0) {
                        obj.stage = obj.width;
                        el.style.left = "-" + obj.stage + "px";
                        obj.overlay.style.opacity = 0;
                        obj.overlay.style.visibility = "hidden";
                    }
                } else {
                    el.style.left = "0";
                    obj.stage = 0;
                    obj.overlay.style.opacity = 0.5;
                    obj.overlay.style.visibility = "visible";
                }
            } else {
                if (e.deltaX < -Math.abs(obj.width / 2)) {
                    obj.stage = obj.width;
                    el.style.left = "-" + obj.stage + "px";
                    obj.overlay.style.opacity = 0;
                    obj.overlay.style.visibility = "hidden";
                } else {
                    el.style.left = "0";
                    obj.stage = 0;
                    obj.overlay.style.opacity = 0.5;
                    obj.overlay.style.visibility = "visible";
                }
            }

        });
        bs.select(obj.overlay).bind("click", function () {
            obj.stage = obj.width;
            el.style.left = "-" + obj.stage + "px";
            obj.overlay.style.opacity = 0;
            obj.overlay.style.visibility = "hidden";
        });
        return obj;
    }

    // navigation drawer
    chai.navigationDrawer = function (drawer) {
        var obj = {};
        var hammer;
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");

        obj.create = function () {
            drawer.appendChild(overlay);
            hammer = addTouchGestures (drawer);
            obj.close();
            return obj;
        };
        obj.open = function () {
            drawer.style.left = "0";
            hammer.stage = 0;
            hammer.overlay.style.opacity = 0.5;
            hammer.overlay.style.visibility = "visible";
            return obj;
        };
        obj.close = function () {
            hammer.stage = hammer.width;
            drawer.style.left = "-" + hammer.stage + "px";
            hammer.overlay.style.opacity = 0;
            hammer.overlay.style.visibility = "hidden";
            return obj;
        };
        return obj;
    };

    // options menu
    chai.optionsMenu = function (el) {
        bs.select(el).unbind("click");
        var obj = {};
        var menu = document.createElement("div");
        var overlay = document.createElement("div");
        bs.select(overlay).css({
            position: "fixed",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            zIndex: 9,
            visibility: "hidden"
        });
        var height = 0;
        var width = 0;
        var is_open = false;
        bs.select(menu).attr("class", "chai options menu").css({
            visibility: "hidden"
        });
        obj.addOption = function (s, callback) {
            var option = document.createElement("div");
            option = bs.select(option).attr("class", "option").html(s).bind("click", callback);
            menu.appendChild(option.get());
            return obj;
        };
        obj.create = function () {
            el.appendChild(menu);
            height = menu.clientHeight;
            width = menu.clientWidth;
            el.appendChild(overlay);
            obj.close();
            return obj;
        };
        obj.open = function () {
            bs.select(menu).css({
                height: height + "px",
                width: width + "px",
                opacity: "1",
                visibility: "visible"
            });
            is_open = true;
            bs.select(overlay).css({
                visibility: "visible"
            });
            return obj;
        };
        obj.close = function () {
            bs.select(menu).css({
                height: "0",
                width: width - 10 + "px",
                opacity: "0",
                visibility: "hidden",
                transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
            });
            bs.select(overlay).css({
                visibility: "hidden"
            });
            is_open = false;
            return obj;
        };

        bs.select(el).bind("click", function () {
            if (!is_open) {
                obj.open();
            } else {
                obj.close();
            }
        });
        return obj;
    };
}(bs, chai);