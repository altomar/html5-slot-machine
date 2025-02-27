import Slot from "./Slot.js";

window.onload = () => {
  const config = {
    inverted: false, // true: reels spin from top to bottom; false: reels spin from bottom to top
    award: "at_at",
  };

  const slot = new Slot($("#slot")[0], config, $("#spin")[0], false);
  slot.award = "diamond";

  // const slotWin = new Slot($("#slotWin")[0], config, $("#spinWin")[0], true);
  // slotWin.award = "seven";

  // form

  var spinsLeft = $("#spins-left")[0];

  var message = $("#error_message").parent();
  var $errorMessage = $("#error_message");

  $("#btn-submit").click(function () {
    var email = $("input[name=email]").val();
    var name = $("input[name=firstname]").val();
    // var number = $("input[name=phone]").val();
    var number = "";
    var birthday = $("input[name=birthday]").val();
    var userip = $("input[name=user_ip]").val();
    var refurl = "casinolistcanada.com";
    var refname = "casinolistcanada.com_t";
    var country = "CA";
    var timestamp = $("input[name=timestamp]").val();
    var valid_email =
      /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
    var letters = /^[A-Za-z]+$/;
    var numbers = /^[0-9]+$/;
    var nameError = "Please enter your name.";
    // var emptyfield = "Please enter your phone number or e-mail address.";
    var emptyfield = "Please enter your e-mail address.";
    var numberError = "Please enter a valid phone number.";
    var emailError = "Please enter a valid e-mail address.";
    var checkboxError = "Please check the box to participate.";
    var output_error = "";
    var checkmark = "Subscription sent!";

    if (output_error != "") {
      document.getElementById("input_error").innerHTML = "";
    } else if (name == "" || !name.match(letters)) {
      document.getElementById("name").classList.add("wrong-border");
      message.show();
      $errorMessage.html(nameError);
      return false;
    } else {
      if (number == "" && email == "") {
        message.show();
        d$errorMessage.html(emptyfield);
        return false;
      } else {
        if (number == "" && email != "") {
          if (!email.match(valid_email)) {
            document.getElementById("email").classList.add("wrong-border");
            $errorMessage.html(emailError);
            message.show();
            return false;
          } else {
            if (!document.getElementById("checkbox").checked) {
              $errorMessage.html(checkboxError);
              document
                .getElementById("label-checkbox")
                .classList.add("wrong-text");
              message.show();
              return false;
            } else {
              return sendToBacom();
            }
          }
        } else if (number != "" && email == "") {
          if (!number.match(numbers)) {
            document.getElementById("phone").classList.add("wrong-border");
            $errorMessage.html(numberError);
            message.show();
            return false;
          } else {
            if (!document.getElementById("checkbox").checked) {
              $errorMessage.html(checkboxError);
              document
                .getElementById("label-checkbox")
                .classList.add("wrong-text");
              message.show();
              return false;
            } else {
              return sendToBacom();
            }
          }
        } else if (number != "" && email != "") {
          if (!document.getElementById("checkbox").checked) {
            $errorMessage.html(checkboxError);
            document
              .getElementById("label-checkbox")
              .classList.add("wrong-text");
            message.show();
            return false;
          } else {
            return sendToBacom();
          }
        }
      }
    }

    function sendToBacom() {
      console.log("sending to bacom");
      message.hide();
      $.ajax({
        type: "GET",
        url: "https://bacom.dk/subscribe/gig/",
        data: {
          firstname: name,
          email: email,
          phone: number,
          user_ip: userip,
          ref_name: refname,
          ref_url: refurl,
          timestamp: timestamp,
          country: country,
          birthday: birthday,
        },
        success: function (res) {
          if (res == "FAIL") {
            // document.getElementById("error_message").innerHTML = "Please try again later :(";
            $errorMessage.html("Good luck!");
            message.show();
            console.log(birthday, name, email);
            $("#slot").hide();
            $("#slotWin").show();
            const slotWin = new Slot(
              $("#slotWin")[0],
              config,
              $("#spinWin")[0],
              true
            );
            slotWin.award = "seven";
          } else {
            message.removeClass("is-danger").addClass("is-success");
            $errorMessage.html("Thanks for subscribing!");
            message.show();
          }
        },
      });
      return false;
    }
  });
};
