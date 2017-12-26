!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.select").each(function (el) {
            el.children().find("input[type='text']").attr("disabled", "disabled");
            bs.select(el.children().find("ul").get()).children().bind("click", function () {
                console.log(this.getAttribute("data-value"));
                el.children().find("input[type='hidden']").get().value = this.getAttribute("data-value");
                el.children().find(".label").html(this.innerHTML);
            });
            bs.select(el.children().find("ul").get()).children().each(function (_el) {
                el.children().find("input[type='hidden']").get().value = bs.select(el.children().find("ul").get()).children().get(0).getAttribute("data-value");
                el.children().find(".label").html(bs.select(el.children().find("ul").get()).children().get(0).innerHTML);
                if (_el.attr("data-default") === "true") {
                    el.children().find("input[type='hidden']").get().value = _el.attr("data-value");
                    el.children().find(".label").html(_el.html());
                }
            });
        });
    }, false);
}(bs, chai);