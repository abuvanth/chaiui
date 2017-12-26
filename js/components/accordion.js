!function (bs, chai) {
    chai.accordion = {};
    chai.accordion.init = function () {
        bs.selectAll(".chai.accordion").each(function (el) {
            el.children().each(function (el) {
                bs.select(el.children().get()).bind("click", function () {
                    el.siblings().removeClass("visible");
                    el.toggleClass("visible");
                });
            });
        });
    };
}(bs, chai);