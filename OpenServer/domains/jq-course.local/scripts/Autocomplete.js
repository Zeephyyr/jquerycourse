var AutoComplete=  function(){
    var ac=this;
    var tags=[];

    var tagStorage;
    var autoCompleteContainer;
    var containerSource;

    var init=function(){
        tagStorage=config.tagStorage;
        autoCompleteContainer=config.autoCompleteContainer;

        return ac;
    };

    ac.loadAutoComplete = function(){
        //get from cache
        tags=getCache();
        if(tags){
                tags=tags.split(',');
                assignTags();
        }
        //if no tags in cache - load them from server
        else{
            $.ajax({
                    type:'GET',
                    dataType: 'json',
                    url:urlHelper.tagSource
                }).done(function(response){
                    tags=response.titles;
                    addToCache();
                    assignTags();
                });
        }
    };

    //functions to work with storage
    var getCache = function(){
        return localStorage.getItem(tagStorage);
    };

    var addToCache = function(){
        localStorage.setItem(tagStorage,tags); 
    };

    //perform autocomplete
    var assignTags=function(){
        autoCompleteContainer.autocomplete({
            source: tags
        });
    };

    return init();
}


