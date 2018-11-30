var cfg;

require(["gitbook", "jQuery"], function(gitbook, $) {

    gitbook.events.bind("start", function(e, config) {
        cfg = config['lotadata-feedback'];
    });

    gitbook.events.bind("page.change", function(e) {
        console.log('page has changed inside handler');

        function sendToSlack(text) {
            request_data = {
                "channel": cfg['slack-channel'],
                "text": text,
                "username": "webhookbot",
                "icon_emoji": " :ghost:"
            }

            $.post(cfg['slack-webhook'], JSON.stringify(request_data), function(data) {
                console.log("success", data);
                thanksForFeedback();
            });
        }


        function thanksForFeedback() {
            elementStyle = 'border: #ffbd44 2px solid;border-radius: 5px;padding: 5px;margin-left: 10px;color: #ffbd44;'
            $("#page-feedback-buttons").html('<span style="' + elementStyle + '">Thank you</span>')
            $("#page-feedback-yes").hide();
            $("#page-feedback-no").hide();
        }


        $(function() {
            $("#page-feedback-yes").on("click", function(e) {
                $.getJSON ('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
                    sendToSlack("<" + window.location.href + "|" + document.title + "> is helpful! :bowtie: :balloon:" + "|" + JSON.stringify (data, null, 2));
                });                
            });
        });


        $(function() {
            $("#page-feedback-no").on("click", function(e) {
                $.getJSON ('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
                    sendToSlack("<" + window.location.href + "|" + document.title + "> is *not* helpful! :dizzy_face: :poop:" + "|" + JSON.stringify (data, null, 2));
                });
            });
        });

    });
});