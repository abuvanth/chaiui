!function (bs, chai) {
    chai.dropdown = {};
    chai.dropdown.init = function () {
        bs.selectAll(".chai.dropdown:not(.disabled)").each(function (el) {
            var overlay = document.createElement("div");
            overlay.setAttribute("class", "overlay");
            overlay.style.visibility = "hidden";
            el.append(overlay);
            el.bind("click", function () {
                if (this.classList.contains("visible")) {
                    bs.select(this).children().get(bs.select(this).children().size() - 1).style.visibility = "hidden";
                    bs.select(this).removeClass("visible");
                } else {
                    bs.select(this).addClass("visible");
                    bs.select(this).children().get(bs.select(this).children().size() - 1).style.visibility = "visible";
                }
            });
        });
    };
}(bs, chai);
