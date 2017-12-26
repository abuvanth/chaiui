!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.range").each(function (el) {
            el.on("input", function () {
                var min = this.min;
                var max = this.max;
                var val = this.value;

                this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
                if (parseFloat(val) === 0.0) {
                    bs.select(this).addClass("zero");
                } else {
                    bs.select(this).removeClass("zero");
                }
            });
        });
    }, false);
}(bs, chai);