var AccordionMenu=function(){
    'use strict';
    var am=this;

    var catTmpl;
    var submenuTmpl;

    var catTmplKey;
    var submenuTmplKey;
    var navDataKey;
    var activeAccKey;

    var navData;

    var navAcc;
    var ulId;

    var rawData;

    var init=function(){
        catTmplKey=config.catTmplKey;
        submenuTmplKey=config.submenuTmplKey;
        activeAccKey=config.activeAccKey;

        navAcc=config.navAcc;
        ulId=config.ulId;

        getDataFromStorage();

        return am;
    };

    //gets data from local storage
    var getDataFromStorage=function(){
        rawData = localStorage.getItem(navDataKey);
        catTmpl=localStorage.getItem(catTmplKey);
        submenuTmpl=localStorage.getItem(submenuTmplKey);
    }


    //appends data 
    am.appendData=function(){
        var navDataPromise=new Promise((resolve,reject)=>{
            if(rawData){
                navData=JSON.parse(rawData);
                resolve();
            }
            else{
                getNavData().then(resolve);
            }
        });
        var catTmplPromise=new Promise((resolve,reject)=>{
            if(catTmpl){
                resolve();
            }
            else{
                getCatTemplate().then(resolve);
            }
            
        });
        var submenuTmplPromise=new Promise((resolve,reject)=>{
            if(submenuTmpl){
                resolve();
            }
            else{
                getSubmenuTemplate().then(resolve);
            }
        });

        Promise.all([navDataPromise,catTmplPromise,submenuTmplPromise]).then(function(){
            appendToIndex();
        });
    }
    
    //requests to the server
    var getNavData=function(){
        return $.ajax({
                    type:'GET',
                    dataType: 'json',
                    url:urlHelper.menuSource
                }).done(function(response){
                    debugger;
                    rawData=JSON.stringify(response);
                    localStorage.setItem(navDataKey,rawData);
                    navData=response;
                    loadedComponents++;
                });
    };

    var getCatTemplate=function(){
        return $.get(urlHelper.catTemplate,function(template){
            catTmpl=template;
            localStorage.setItem(catTmplKey,template);
            loadedComponents++;
        });
    };

    var getSubmenuTemplate=function(){
        return $.get(urlHelper.submenuTemplate,function(template){
            submenuTmpl=template;
            localStorage.setItem(submenuTmplKey,template);
            loadedComponents++;
        });
    };

    //appends accordion data to templates and templates to index page
    var appendToIndex=function(){
        navData.forEach(function(item,i,navData){
            var insertItem={
                title:item.title,
                id:ulId+i
            };

            $.tmpl(catTmpl,insertItem).appendTo(navAcc);

            var subArray;
            if(subArray=item.subitems){
                subArray.forEach(function(subitem,j,subArray){
                    $.tmpl(submenuTmpl,subitem).appendTo($('#'+insertItem.id));
                });
            }
        });

        var active=localStorage.getItem(activeAccKey);
        if(!active){
            active=0;
        }

        $( function() {
                navAcc.accordion({
                    collapsible: true,
                    active:parseInt(active),
                    activate:function(){
                        active=navAcc.accordion( "option", "active" );
                        localStorage.setItem(activeAccKey,active)
                    }
                });
        });
    };

    return init();
}