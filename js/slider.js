/**
 * Take the difference between the dates and divide by milliseconds per day.
 * Round to nearest whole number to deal with DST.
 *
 * @param first
 * @param second
 * @returns {number}
 */
function datediff(dt1, dt2) {
    console.log(dt2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

/**
 * Add dates to JS Date()
 * @param date
 * @param days
 * @returns {Date}
 */
function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

/**
 * Format a date object to the Danish format.
 * @param d
 * @returns {string}
 */
function formatDate(d) {
    return d.getDate() + "/" + (d.getMonth() + 1) + "-" + d.getFullYear();
}

/**
 * Listens to events on the slider
 */
addEventListener('input', e => {
    let _t = e.target,
        _p = _t.parentNode,
        val = +_t.value,
        _o = _p.querySelector(`option[value='${val}']`);
        // lbl = +_o.label;

    console.log(_o.label);
    currentIndex = _o.label;
    setSliderLabel(_dates[currentIndex]);
    themesToogle();
    updateDate();
    createBars();
}, false);

function setSliderLabel(label) {
    document.getElementById('slider-label').innerHTML = label;
}

function buildDatalist(datalistID) {
    var s = '';

    for (var i = 0; i<delta_in_days; i++ ) {
        var slider_date = addDays(first_day_of_corona, i);
        var slider_label = formatDate(slider_date);
        _dates.push(slider_label);
        s = s + '<option value="' + i +'" label="' + i + '">' + i + '</option>\n'
    }

    const datalistNode = document.getElementById('l');
    datalistNode.innerHTML= s;
}

/**
 * Set up slider.
 * @param elementId
 */
function setUpSlider(elementId) {
    const b = document.getElementById(elementId);
    b.setAttribute('max', delta_in_days)
    b.setAttribute('value', 2)
    b.value = _dates[_dates.length-1];
    buildDatalist('l');
    setSliderLabel(_dates[_dates.length-1]);
}

var _dates = [];

var first_day_of_corona = new Date(2020, 2, 22);
var today = new Date();
var delta_in_days = datediff(first_day_of_corona, today);

setUpSlider('b');

