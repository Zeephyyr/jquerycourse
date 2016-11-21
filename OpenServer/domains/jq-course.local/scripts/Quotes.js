var QuoteManager = function () {
    
    var qm = this;
    var quoteContainer;

    var quoteKey;

    var init = function(){
        quoteContainer=config.quoteContainer;
        quoteKey=config.quoteKey;

        return qm;
    }

    //gets quotes and stores the last one in case of a server error
    qm.getQuote = function () {
    $.ajax({
            type:'GET',
            dataType: 'jsonp',
            url:urlHelper.quoteSource,
            success: function(response){
                if(response)
                {
                    quoteContainer.text(response.text+" - "+response.author);
                    localStorage.setItem(quoteKey,response);
                }
                else
                {
                    onError(response);
                }
            },
            error: function(response){
                onError(response);
            }
        });
    }; 

    var onError=function(response){
        response=localStorage.getItem(quoteKey);
        if(response)
        {
            quoteContainer.text(response.text+" - "+response.author);
        } 
    }

    return init();
}



