/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var stripe = Stripe("pk_test_51HlGrkFjByhTo8fA6n37riDVLxXV2hwVEPWy7YdrV7xPYj20F7944xK8616H5B0oH2lSlNwxfc12GpE2wueE20vV00wSI1B1c7");

function visitDonationCheckout() {
    if (currentUser.uid == null) {
        window.location.replace("/auth?go=/about/donate.html");
    }

    if ($(".donationAmountInput input").val() == "") {
        $("#donationAmountError").text(_("Please enter an amount to donate."));

        return;
    }

    var currency = $(".donationAmountInput select option:selected").val();
    var amount = Number($(".donationAmountInput input").val());

    if (!(ZERO_DECIMAL_CURRENCIES.includes(currency))) {
        amount = amount * 100;
    }

    if (amount < 50) {
        $("#donationAmountError").text(_("Sorry, your donation amount is too small. Try entering a bigger amount!"));

        return;
    } else if (amount > 1000000) {
        $("#donationAmountError").text(_("Sorry, your donation amount is too large. Try entering a smaller amount!"));

        return;
    }

    $(".donationAmountInput button").prop("disabled", true);
    $(".donationAmountInput button").text(_("Processing..."));

    fetch(`https://us-central1-glipo-net.cloudfunctions.net/donations/createPayment/${currency}/${amount}/${currentUser.uid}`, {
        method: "POST"
    }).then(function(response) {
        return response.json();
    }).then(function(session) {
        return stripe.redirectToCheckout({sessionId: session.id});
    }).then(function() {
        if (result.error) {
            console.error("Glipo donation error: ", result.error.message);

            $(".donationAmountInput button").prop("disabled", false);
            $(".donationAmountInput button").text(_("Donate"));
            $("#donationAmountError").text(_("Sorry, an internal error has occurred. Please try donating again later."));
        }
    }).catch(function(error) {
        console.error("Glipo donation error: ", error.message);

        $(".donationAmountInput button").prop("disabled", false);
        $(".donationAmountInput button").text(_("Donate"));
        $("#donationAmountError").text(_("Sorry, an internal error has occurred. Please try donating again later."));
    });
}

$(function() {
    $(".donationAmountInput select, .donationAmountInput input").change(function() {
        var selectedCurrency = $(".donationAmountInput select option:selected").val();

        $(".donationAmountInput .currencySymbol").text(CURRENCY_SYMBOLS[selectedCurrency]);

        if (ZERO_DECIMAL_CURRENCIES.includes(selectedCurrency)) {
            $(".donationAmountInput input").attr("min", "1");
            $(".donationAmountInput input").attr("max", "1000000");
            $(".donationAmountInput input").attr("step", "1");
            $(".donationAmountInput input").attr("value", "5");
        } else {
            $(".donationAmountInput input").attr("min", "0.01");
            $(".donationAmountInput input").attr("max", "10000");
            $(".donationAmountInput input").attr("step", "0.01");
            $(".donationAmountInput input").attr("value", "5.00");
        }

        if ($(".donationAmountInput input").val().match(/^\d+$/) && !(ZERO_DECIMAL_CURRENCIES.includes(selectedCurrency))) {
            $(".donationAmountInput input").val($(".donationAmountInput input").val() + ".00");
        } else if (!($(".donationAmountInput input").val().match(/^\d+$/)) && ZERO_DECIMAL_CURRENCIES.includes(selectedCurrency)) {
            $(".donationAmountInput input").val($(".donationAmountInput input").val().replace(/\./g, "").replace(/,/g, ""));
        }
    });

    $(".donationAmountInput input").keypress(function(event) {
        if (event.keyCode == 13) {
            visitDonationCheckout();
        }
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.replace("/auth?go=/about/donate.html");
        }
    });
});