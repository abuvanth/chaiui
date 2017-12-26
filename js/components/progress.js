!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.spinner:not(.legacy)").html('<div class="circle circle-1">\n' +
            '                <div class="circle-inner"></div>\n' +
            '            </div>\n' +
            '            <div class="circle circle-2">\n' +
            '                <div class="circle-inner"></div>\n' +
            '            </div>');
    }, false);

    chai.createSpinnerLegacy = function (el) {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);
        var obj = {};

        obj.show = function () {
            bs.select(overlay).css({
                visibility: "visible",
                opacity: "1"
            });
            bs.select(el).css({
                visibility: "visible",
                opacity: "1",
                top: "50%"
            });
            return obj;
        };
        obj.hide = function () {
            bs.select(overlay).css({
                visibility: "hidden",
                opacity: "0"
            });
            bs.select(el).css({
                visibility: "hidden",
                opacity: "0",
                top: "60%"
            });
            return obj;
        };
        overlay.addEventListener("click", function () {
            obj.hide();
        }, false);
        return obj;
    }
}(bs, chai);