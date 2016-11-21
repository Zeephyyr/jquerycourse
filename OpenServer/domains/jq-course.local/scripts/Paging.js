var PagingManager=function(){
    var pm=this;

    var newsTmpl;
    var newsData;
    var newsDiv;
    
    var rawData;

    var activePage;
    var totalPages;

    var nextBt;
    var prevBt;
    var numSpan;
    var $pgPlug;

    var init=function(){
        newsDiv=config.newsDiv;
        numSpan=config.numSpan;

        nextBt=config.nextBt;
        prevBt=config.prevBt;

        alreadyAppended=false;
        getPageFromHash();

        nextBt.click(onNext);
        prevBt.click(onPrev);

        return pm;
    };

    pm.preparePaging=function(){
        getDataFromStorage();      

        initData();
    };
    
    var getTotalPages=function(count){
        totalPages=Math.floor(count/config.newsPerPage);
        if(count%config.newsPerPage>0){
            totalPages++;
        }
    };

    //gets template and data from server/cache, initializes paging plugin with basic settings
    var initData=function(){
        var newsTmplPromise=new Promise((resolve,reject)=>{
            if(newsTmpl){
                resolve();
            }
            else{
                getNewsTemplate().then(resolve);
            }
        });

        var newsDataPromise=new Promise((resolve,reject)=>{
            if(newsData){
                newsData=JSON.parse(newsData);
                getTotalPages(newsData.stories.length);
                initPlug();
                resolve();
            }
            else{
                getNewsData().then(resolve);
            }
        });
        
        Promise.all([newsTmplPromise,newsDataPromise]).then(function(){
            appendData();
        });
        
    };

    var initPlug=function(){
        $pgPlug=newsDiv.customPagination({
                totalPages:totalPages,
                perPage:config.newsPerPage,
                nextBt:nextBt,
                prevBt:prevBt,
                numSpan:numSpan,
                activePage:activePage,
                appendDataFunc:appendData
            });
    };

    //attempt to get da page number from hash anchor
    var getPageFromHash=function(){
        var hash=window.location.hash;
        var expr='[1-9]+';
        var res=hash.match(expr);

        if(res){
            activePage=parseInt(res);
            numSpan.text('Page '+activePage);
        }else{
            activePage=1;
            hash='#'+activePage;
        }
    };

    //appends data to template
    var appendData=function(){
        activePage=$pgPlug.customPagination('getPage');
        var newsArray=newsData.stories;

        var startIndex=(activePage-1)*config.newsPerPage;
        var endIndex=startIndex+config.newsPerPage;

        if(endIndex>=newsArray.length){
            endIndex=newsArray.length;
        };

        var resArray=new Array();

        for(startIndex;startIndex<endIndex;startIndex++){
            resArray.push(newsArray[startIndex]);
        }

        resArray.forEach(function(elem,i,resArray){
            $.tmpl
            (newsTmpl,elem).appendTo(newsDiv);
        });
    };


    var onNext=function(){
        $pgPlug.customPagination('next');
    };

    var onPrev=function(){
        $pgPlug.customPagination('prev');
    };

    var getDataFromStorage=function(){
        newsTmpl=localStorage.getItem(config.newsTmplKey);
        newsData=localStorage.getItem(config.newsDataKey);
    };

    var getNewsTemplate=function(){
        return $.get(urlHelper.pagingTemplate,function(template){
            newsTmpl=template;
            localStorage.setItem(config.newsTmplKey,template);
        });
    };

    var getNewsData=function(){
        return $.ajax({
                    type:'GET',
                    dataType: 'json',
                    url:urlHelper.pagingSource
                }).done(function(response){
                    rawData=JSON.stringify(response);
                    localStorage.setItem(config.newsDataKey,rawData);
                    newsData=response;
                    getTotalPages(newsData.stories.length);
                    initPlug();
                });
    };

    return init();
}