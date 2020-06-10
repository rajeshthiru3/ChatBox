var buttonclass = "continuous"; // stacked, continuous classes

var json;
jsonload = $.getJSON('js/responses.json', function() {
    json = jsonload.responseJSON;
    buildDefaultButtons();
});


$("#homebtn").on("click", function(event) {
    buildDefaultButtons();
    homebtn.style.display = 'none';
});

function buildButtons(btns) {
    btnshtml = "";
    for (i in btns) {
        btnhtml = "<div class='" + buttonclass + "'>" + btns[i] + "</div>";
        btnshtml += btnhtml;
    }
    return btnshtml;
}

function buildDefaultButtons() {
    defaultbtns = json.buttongroup.default;
    console.log(defaultbtns);
    var buttonsHTML = buildButtons(defaultbtns);
    buttongrid.innerHTML = buttonsHTML;
    setOnClickHandler();
    message.innerHTML = json.replies.default;
}

function setOnClickHandler() {
    $("." + buttonclass).on("click", btn_onClick);
}

function btn_onClick(event) {
    btn = event.target;
    var req = btn.innerHTML;
    if (req == "") {
        return;
    }

    console.log(req);
    // check for buttons
    var btns = json.buttongroup[req];
    console.log(btns)

    if (!btns) {
        // check for links
        var link = json.links[req];
    } else {
        var buttonsHTML = buildButtons(btns);
        console.log(buttonsHTML);
        buttongrid.innerHTML = buttonsHTML;
        setOnClickHandler();
        message.innerHTML = json.replies[req];
        homebtn.style.display = "block";
        return;
    }

    if (!link) {
        // check for popups
        var popup = json.popups[req];
    } else {
        location.href = link;
        return;
    }

    if (!popup) {
        // error
        message.innerHTML = "Data not available."
        buttongrid.innerHTML = "";
        return;
    } else {
       ele = buildPopup(popup.id, popup.html);
       console.log(ele);
       btn.classList.add("popup");
       $(btn).off("click")
       btn.innerHTML += ele;
       document.getElementById(popup.id).classList.add("show");
       $(document.getElementById(popup.id)).on("click", function(e) {
            document.getElementById(popup.id).innerHTML = "";
            console.log(e);
            e.stopPropagation();
            document.getElementById(popup.id).parentNode.removeChild(document.getElementById(popup.id));
            btn.classList.remove("popup");
            $(btn).bind("click", btn_onClick);
       });
    }
}

function buildPopup(id, html) {
    popupelement = "<div class='popuptext' id='" + id + "'>" + html + "</div>";
    return popupelement;
}