/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

const ZERO_DECIMAL_CURRENCIES = ["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "vnd", "vuv", "xaf", "xof", "xpf"];

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
});