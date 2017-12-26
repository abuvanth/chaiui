!function (bs, chai) {
    chai.createSnackBar = function (s, interval) {
        if (interval === undefined) { interval = 2000; }
        var div = document.createElement("div");
        div.setAttribute("class", "chai snackbar");
        div.innerHTML = s;
        var obj = {};

        obj.show = function () {
            bs.select(div).removeClass("hidden");
            bs.select(div).addClass("visible");

            setTimeout(function () {
                obj.hide();
            }, interval);
        };

        obj.hide = function () {
            bs.select(div).removeClass("visible");
            bs.select(div).addClass("hidden");
        };

        document.body.appendChild(div);
        return obj;
    };
}(bs, chai);