var chai = {}; // namespace

!function (bs, chai) {
    /* core */

    /* initialize method */
    chai.init = function () {
        chai.stack = [];
        chai.stack.push(bs.select(".chai.activity[data-startup='true']").get());
        bs.selectAll(".chai.activity").each(function (activity) {
            activity.children().find(".chai.action.bar").each(function (el) {
                // paddingTop: el.height() + "px",
                bs.select(activity.get().querySelector(".chai.body")).css({
                    height: window.innerHeight + "px"
                })
            });
            if (activity.attr("data-startup") !== "true") {
                activity.css({
                    opacity: "0",
                    top: "10%",
                    visibility: "hidden",
                    position: "absolute",
                    zIndex: "-999"
                });
            }
        });
        // bs.selectAll(".chai.button:not(.disabled):not(.ignore)").bind("click", chai.addRippleEffect);
        // bs.selectAll(".chai.list").addClass("flat").bind("click", chai.addRippleEffect);

        chai.accordion.init();
        chai.dropdown.init();
    };

    window.addEventListener("load", chai.init, false);

    /* activity */
    chai.startActivity = function (activity) {
        bs.selectAll(".chai.activity").each(function (activity) {
            activity.css({
                opacity: "0",
                top: "10%",
                visibility: "hidden",
                position: "absolute",
                zIndex: "-999"
            }).addClass("notrans");
        });
        bs.select(activity).removeClass("notrans").css({
            opacity: "1",
            top: "0",
            visibility: "visible",
            position: "absolute",
            zIndex: "1"
        });
        chai.stack.push(activity);
    };
    chai.finishActivity = function () {
        var obj = {};
        console.log(chai.stack);
        obj.onFirstActivity = function (callback) {
            if (chai.stack.length === 1) {
                callback();
            }
            return obj;
        };

        if (chai.stack.length !== 1) {
            chai.startActivity(chai.stack[chai.stack.length - 2]);
            chai.stack.pop();
            chai.stack.pop();
            console.log(chai.stack);
        }

        return obj
    };
}(bs, chai);