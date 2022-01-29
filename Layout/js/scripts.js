window.addEventListener('load', function (e) {
    var form = document.querySelector('.form');
    var inputs = document.querySelectorAll('.Check');

    form.addEventListener('submit', function (e) {
        var error = false;

        for (var i = 0; i < inputs.length; i++) {
            var val = inputs[i].value.trim();

            if (val != '') {
                inputs[i].classList.remove('error');
            }
            else {
                error = true;
                inputs[i].classList.add('error');

            }
        }
        if (error) {
            e.preventDefault();
        }
    });
});