// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en dispositivos/emuladores Ripple o Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.


//var Nums = [[], [04, 08, 12, 24, 30, 49], [08, 11, 12, 30, 33, 37], [03, 05, 08, 10, 12, 30], [07, 08, 10, 12, 13, 30], [08, 12, 20, 23, 25, 30], [01, 08, 12, 30, 33, 36], [08, 12, 19, 30, 40, 43], [03, 08, 12, 13, 18, 30]];
var Nums = [[], ['04', '08', '12', '24', '30', '49'],
                ['08', '11', '12', '30', '33', '37'],
                ['03', '05', '08', '10', '12', '30'],
                ['07', '08', '10', '12', '13', '30'],
                ['08', '12', '20', '23', '25', '30'],
                ['01', '08', '12', '30', '33', '36'],
                ['08', '12', '19', '30', '40', '43'],
                ['03', '08', '12', '13', '18', '30']];
(function () {
    //"use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    $(window).load(function(){Init();});

    function onDeviceReady() {
        // Controlar la pausa de Cordova y reanudar eventos
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.
    };

    function onPause() {
        // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    };

    function onResume() {
        // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    };
})();
    
    var URL = 'http://www.loteriasyapuestas.es/es/la-primitiva/resultados/.formatoRSS';
    google.load("feeds", "1");
    
    
    var Resultats = [];
    var Anterior = null;
    var Refresh = true;

    function SetUp() {
        $('.DIA').remove();
        var feedpointer = new google.feeds.Feed(URL);
        feedpointer.setNumEntries(30);
        feedpointer.load(Loaded);

        function Loaded(result) {
            for (x = 0; x < result.feed.entries.length; x = x + 2) {
                GetInfo(result, x);
                VerificarPremio(x);
                MostrarDades(x);
                if (Refresh == true && x == 0) {
                    var LastDate = result.feed.entries[0];
                    if (Anterior != null) {
                        if (Anterior.publishedDate != LastDate.publishedDate) {
                            Refresh = false;
                            var my_media = new Media('http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3');
                            my_media.play();
                        }
                    }
                    if (Anterior == null) { Anterior = LastDate; }
                }
            }
        }
        if (Refresh == true) { setTimeout(function () { SetUp(); }, 5 * 60 * 1000) }
    }

    function doMenu() {
        $('#menu').show();
    }

    function GetInfo(result, index) {
        var Dades = result.feed.entries[index];
        Resultats[index] = [];
        Resultats[index][0] = Dades.title.split('del ')[1];
        for (i = 0; i < 6; i++) { Resultats[index][i + 1] = Dades.content.split('<p>')[2].split('<b>')[1].split('<')[0].split(' - ')[i] }
        Resultats[index][8] = Dades.content.split('<p>')[2].split('<b>')[3].split('(')[1].split(')')[0];
        Resultats[index][7] = Dades.content.split('<p>')[2].split('<b>')[2].split('(')[1].split(')')[0];
        for (i = 10; i < 16; i++) { Resultats[index][i] = 0; }
    }

    function MostrarDades(index) {
        var dades = Resultats[index];
        var Control = '#N' + index;
        var Resultat = "";
        $('body').append("<div class='DIA' id='CONT" + index + "'></div>");
        $("#CONT" + index).append("<div id='D" + index + "'></div>");
        $('#D' + index).html(dades[0]);
        $("#CONT" + index).append("<div id='I" + index + "'></div>");

        for (i = 1; i < 7; i++) {
            if ((dades[i] == '30') || (dades[i] == '12') || (dades[i] == '08') || (dades[i] == '8')) { $('#I' + index).append("<input id='" + 'N' + index + i + "' type='text' class='NUM_OK' >"); }
            else { $('#I' + index).append("<input id='" + 'N' + index + i + "' type='text'  class='NUM' >"); }
            $(Control + i).val(dades[i]);
        }

        $('#I' + index).append('  C');
        $('#I' + index).append("<input id='C" + index + "' type='text' >");
        $('#C' + index).val(dades[7]);
        $('#I' + index).append(' R');
        $('#I' + index).append("<input id='R" + index + "' type='text' >");
        $('#R' + index).val(dades[8]);
        $('#I' + index).append("<p id='S" + index + "'></p>");

        if (dades[15] == 1) {
            for (iP = 10; iP < 14; iP++) {
                if (dades[iP] == 1) { Resultat = Resultat + 'Una' + " apuesta de " + (iP - 7) + " aciertos " + '<br/>'; }
                if (dades[iP] >= 2) { Resultat = Resultat + dades[iP] + " apuestas de " + (iP - 7) + " aciertos " + '<br/>'; }
            }
        }
        else { Resultat = 'SIN PREMIO...'; }
        $('#S' + index).html(Resultat);

        //$("#CONT" + index).append( "<br/>");
    }

    function VerificarPremio(index) {
        var Ret;
        for (iA = 1; iA < 9; iA++) {
            ret = Comprobar(index, iA)
            if (ret == 3) { Resultats[index][10] = Resultats[index][10] + 1; }
            if (ret == 4) { Resultats[index][11] = Resultats[index][11] + 1; }
            if (ret == 5) { Resultats[index][12] = Resultats[index][12] + 1; }
            if (ret == 6) { Resultats[index][13] = Resultats[index][13] + 1; }
            if (ret > 2) { Resultats[index][15] = 1; }
        }

    }

    function Comprobar(Dia, Apuesta) {
        Aciertos = 0;
        for (iANum = 1; iANum < 7; iANum++) {
            for (iRNum = 1; iRNum < 7; iRNum++) {
                console.log(parseInt(Resultats[Dia][iRNum]) + '   ' + Nums[Apuesta][iANum - 1]);
                if (parseInt(Resultats[Dia][iRNum]) == parseInt(Nums[Apuesta][iANum - 1])) {
                    Aciertos = Aciertos + 1;
                }
            }


        }
        return Aciertos;
    }


    function Init() {
        document.addEventListener("menubutton", doMenu, false);
        SetUp();
    }

    




function Actualizar() {
        SetUp();
        $('#menu').hide();
    }