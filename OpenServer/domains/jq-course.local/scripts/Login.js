var AuthModule = function(){
    var am=this;
    var dialogDiv;
    
    var loginFormId;
    var regFormId;

    var authSessionKey;
    var dialogTmplKey;
    var greetTmplKey;
    
    var loginMenu;

    var greetDivId;
    var closeGreetDivBtn;

    var regEmailName;
    var loginEmailName;

    var dialogTmpl;
    var greetTmpl;

    var constGreetMsg='Thanks for the registration. You are logged in as ';

    var init=function(){
        regEmailName=config.regEmailName;
        loginEmailName=config.loginEmailName;

        greetDivId=config.greetDivId;
        closeGreetDivBtn=config.closeGreetDivBtn;

        dialogDiv=$("<div></div>");

        loginFormId=config.loginFormId;
        regFormId=config.regFormId;

        loginMenu=config.loginMenu;

        dialogTmplKey=config.dialogTmplKey;
        greetTmplKey=config.greetTmplKey;
        authSessionKey=config.authSessionKey;

        getFromStorage();
        initDiagTemplate();

        return am;
    };

    var error=function(){

    };

    //append template to dialog
    var initDiagTemplate=function(){
        if(dialogTmpl){
            $.tmpl(dialogTmpl).appendTo(dialogDiv);
        }
    };

    //get templates from storage and/or server
    var getFromStorage=function(){
        greetTmpl=localStorage.getItem(greetTmplKey);
        dialogTmpl=localStorage.getItem(dialogTmplKey);
    };

    var getGreetTmpl=function(){
        $.get(urlHelper.greetTemplate,function(template){
            greetTmpl=template;
            localStorage.setItem(greetTmplKey,template);
            $.tmpl(greetTmpl,{
            message: constGreetMsg + name
            }).appendTo(loginMenu);
        });
    };

    var getDialogTmpl=function(){
        return $.get(urlHelper.loginTemplate,function(template){
            dialogTmpl = template;
            localStorage.setItem(dialogTmplKey,template);
            $.tmpl(dialogTmpl).appendTo(dialogDiv);
        });
    };

    //call for dialog to be displayed
    am.DisplayDialog=function(){
        if(!dialogTmpl){
            getDialogTmpl().then(dialog,error);
        }
        else{
            dialog();
        }
    };
    
    var dialog=function(){
        dialogDiv.dialog();
        $.validate({
            modules : 'security',
            form : '#'+regFormId+',#'+loginFormId
        });
        setButtons();
    }

    am.checkSession=function(){
        var name;

        if(name=localStorage.getItem(authSessionKey))
        {
            changeState(name);
        }
    };

    var setButtons=function(){
        setOnLogin();
        setOnRegister();
    };

    var setOnLogin=function(){
        $('#'+loginFormId).on('submit',login);
    };

    var setOnRegister=function(){
        $('#'+regFormId).on('submit',register);
    };

    var login=function(){
        var obj=$('#'+loginFormId).find('input[name='+loginEmailName+']').val();
        localStorage.setItem(authSessionKey,obj);
        changeState(obj);
        dialogDiv.dialog('close');
    };

    var register=function(){
        var obj=$('#'+regFormId).find('input[name='+regEmailName+']').val();
        localStorage.setItem(authSessionKey,obj);
        changeState(obj);
        dialogDiv.dialog('close');
    };

    var changeState=function(name){
        loginMenu.find('p:first').remove();

        if(greetTmpl){
            $.tmpl(greetTmpl,{
            message: constGreetMsg + name
            }).appendTo(loginMenu);
            onStateChanged();
        }
        else{
            getGreetTmpl().then(onStateChanged,error);
        }
    };

    var onStateChanged=function(){
        $('#'+closeGreetDivBtn)[0].onclick=function(){
            $('#'+greetDivId).remove();
        }
    };

    return init();
}