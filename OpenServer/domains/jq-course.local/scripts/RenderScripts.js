//this function calls for other helpers and utility stuff
$(function(){
    //service that calls for quotes and pastes it into a span
    var quoteManager=new QuoteManager();
    quoteManager.getQuote();
    
    //service that fills and prepares autocomplete search
    var autoComplete=new AutoComplete();
    autoComplete.loadAutoComplete();

    //service that prepares auth functions and allows to login/register
    var authManager=new AuthModule();
    //instantly checks if user has a session cached in storage
    authManager.checkSession();

    //accordion initialization
    var accordionMenu=new AccordionMenu();
    accordionMenu.appendData();

    //paging functionality initialization
    var pagingManager=new PagingManager();
    pagingManager.preparePaging();

    $('#loginLink').click(function(){
        authManager.DisplayDialog();
    });
})