var server = "app.sharewood-zerkalo.com";
//var server = "127.0.0.1";

$(document).ready(function(){
    moment.locale('ru');
    $('.app').load('https://'+server, ready);
});
chrome.runtime.onMessage.addListener(
    function (msg, sender, cb) {
        console.log(msg, sender, cb);
        switch(msg.action){
            case 'getHistory':
                
                cb('test');
            break;
        }
    }
);
function ready(){
    chrome.runtime.sendMessage({action:"statusProxy"}, function(status){
        console.log(status);
        $('#proxy').prop('checked', status);
    });
    var domain = $('#url').html();
    var newhtml = $('section').html();
    $('#history').on('click', function(){
        $('.but').removeClass('active');
        $('#history').addClass('active');
        chrome.history.search({text: domain+'/threads/', maxResults: 20}, function(data) {
            var html = '';
            data.forEach(function(page) {
                html += `<div class="topic">
                    <a target="_blank" href="${page.url}">
                    <div class="data">
                        <div class="name">${page.title}</div>
                        <div class="tags">
                            <div class="date">${moment(page.lastVisitTime).fromNow()}</div>
                        </div>
                    </div>
                    </a>
                </div>`;
            });
            $('section').html(html);
        });
    });
    $('#new').on('click', function(){
        $('.but').removeClass('active');
        $('#new').addClass('active');
        $('section').html(newhtml);
    });
    var search = false;
    function hideSearch(){
        search = false;
        $('.search').css("width", "35px");
        $('.search').css("border-color", "transparent");
        $('.url_link').fadeIn(300);
        $('#search').css("width", "0px");
    }
    $(".search-btn").on("click", function(e){
        e.preventDefault();
        console.log("CLICK", search, $('#search').val());
        if(!search){
            search = true;
            $('.search').css("width", "300px");
            $('.search').css("border-color", "#9e7338");
            $('.url_link').fadeOut(300);
            $('#search').css("width", "250px");
            $('#search').focus();
        }else{
            console.log(domain+'/search/?q='+$('#search').val());
            if($('#search').val() == "")
                return;
            chrome.tabs.create({"url":domain+'/search/?q='+$('#search').val(),"selected":true}, function(tab){
                console.log('add tab',tab);
            });
        }
    })
    $('#search').on("keydown", function(e){
        if(e.code == "Enter"){
            chrome.tabs.create({"url":domain+'/search/?q='+$('#search').val(),"selected":true}, function(tab){
                console.log('add tab',tab);
            });
        }
    })
    $('#search').focusout(function() {
        setTimeout(hideSearch, 300);
    });
    function clearCache(){
        timeperiod = 0;
        dataToRemove = {"cache":true};

        if (chrome['browsingData'] && chrome['browsingData']['removeAppcache']) {
            chrome.browsingData.remove({
              'since': timeperiod
            }, dataToRemove, function() {
                console.log('clear cache');
            });
    
            // new API since Chrome Dev 19.0.1049.3
          } else if (chrome['experimental'] && chrome['experimental'][
            'browsingData'
          ] && chrome.experimental['browsingData']['removeAppcache']) {
            chrome.experimental.browsingData.remove({
              'since': timeperiod
            }, dataToRemove, function() {
                console.log('clear cache');
            });
    
          } else if (chrome['experimental']['browsingData']) {
            // new API since Chrome Dev 19.0.1041.0
            chrome.experimental.browsingData.remove(timeperiod, dataToRemove,
              function() {
                console.log('clear cache');
              });
    
          } else if (chrome['experimental']) {
            // old API
            chrome['experimental'].clear.browsingData(timeperiod, dataToRemove,
              function() {
                  console.log('clear cache');
              });
          }
    }
    $('#proxy').change(function() {
        clearCache();
        if(this.checked) {
            $.get( "https://"+server+"/proxy", function( data ) {
                var data = JSON.parse(data);
                console.log(data.proxy);
                if(data.proxy){
                    code = 'function FindProxyForURL(url, host) {\n';
                    for(var i in data.whiteList){
                        code+=`if (shExpMatch(host, "*${data.whiteList[i]}*")){\n   return 'PROXY ${data.proxy}';\n}\n`;
                    }
                    code += `return 'DIRECT';\n}`;
                    console.log(code);
                    var config = {
                        mode: "pac_script",
                        pacScript: {
                        data: code
                        }
                    };
                    chrome.runtime.sendMessage({action:"setProxy", param:{'status':true}});
                    chrome.proxy.settings.set(
                        {
                            value: config, 
                            scope: 'regular'
                        },
                        function() { 
                            clearCache();
                            console.log("включили прокси");
                        }
                    );
                }
            });
        }else{
            chrome.runtime.sendMessage({action:"setProxy", param:{'status':false}});
            chrome.proxy.settings.clear({});
            clearCache();
        }
    });
}