var columns = {
  "sentence": {field:"sentence", title: "Phrase", valign:"middle", align: "center", rowspan: 2, colspan: 1, formatter: "", sortable: false},

  "emotions": {field:"emotions", title: "Emotions", valign:"middle", align: "center", rowspan: 1, colspan: 5, formatter: "", sortable: false},
  "chats": {field:"chats", title: "Engagement Client", valign:"middle", align: "center", rowspan: 1, colspan: 7, formatter: "", sortable: false},
  "languages": {field:"languages", title: "Languages", valign:"middle", align: "center", rowspan: 1, colspan: 3, formatter: "", sortable: false},

  "anger": {field:"anger", title: "Colère", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "disgust": {field:"disgust", title: "Dégoût", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "fear": {field:"fear", title: "Peur", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "joy": {field:"joy", title: "Joie", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "sadness": {field:"sadness", title: "Tristesse", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},

  "excited": {field:"excited", title: "Excité", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "frustrated": {field:"frustrated", title: "Frustré", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "impolite": {field:"impolite", title: "Impoli", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "polite": {field:"polite", title: "Poli", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "sad": {field:"sad", title: "Triste", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "satisfied": {field:"satisfied", title: "Satisfait", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "sympathetic": {field:"sympathetic", title: "Compatissant", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},

  "analytical": {field:"analytical", title: "Analytique", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "confident": {field:"confident", title: "Confiant", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true},
  "tentative": {field:"tentative", title: "Hésitant", valign:"middle", align: "center", rowspan: 1, colspan: 1, formatter: "", sortable: true}
}

var taCols = [];
var taRow0 = [];
taRow0.push(columns.sentence);
taRow0.push(columns.emotions);
taRow0.push(columns.chats);
taRow0.push(columns.languages);
var taRow1 = [];
taRow1.push(columns.anger);
taRow1.push(columns.disgust);
taRow1.push(columns.fear);
taRow1.push(columns.joy);
taRow1.push(columns.sadness);

taRow1.push(columns.excited);
taRow1.push(columns.frustrated);
taRow1.push(columns.impolite);
taRow1.push(columns.polite);
taRow1.push(columns.sad);
taRow1.push(columns.satisfied);
taRow1.push(columns.sympathetic);

taRow1.push(columns.analytical);
taRow1.push(columns.confident);
taRow1.push(columns.tentative);
taCols.push(taRow0);
taCols.push(taRow1);

$(document)
  .ready(function() {
    // $('#answers').bootstrapTable({locale:'fr-FR'});
    buildTable(taCols);
    $('#sentence').focus();
    // $('#send').prop("disabled", true);
  })
  .ajaxStart(function(){
      $("div#Loading").addClass('show');
      // $("#ajax_loader").show();
  })
  .ajaxStop(function(){
      $("div#Loading").removeClass('show');
      // $("#ajax_loader").hide();
  });

// $("#sentence").change(function (){
//   if($.trim($(this).val())){
//     $('#send').removeClass('disabled');
//     $('#send').prop("disabled", false);
//   }
//   if(!$.trim($(this).val())){
//     $('#send').prop("disabled", true);
//   }
// })

$('#save').click(function (){
  if($('#answers').bootstrapTable('getData').length == 0){
    ShowAlert("Aucun historique", "Il n'y a rien à sauvegarder.", "alert-info");
  }
  else{
    ($('#answers').tableExport({
      type:'csv',
      csvSeparator: ';',
      fileName: 'Watson-Tone-Analyzer-analyses'
    }));
  }
})

$('#erase').click(function (){

    $('#sentence').val("");
    // $('#send').prop("disabled", true);
})

$('#rHistorical').click(function (){

  $.ajax({
    type: 'POST',
    // url: "AGT",
    // url: "ACET",
    url: "GH",
    dataType: 'json',
    success: function(data) {

      if(!data.HISTORICAL || data.HISTORICAL.length == 0){
        ShowAlert("Aucun historique", "Il n'y a rien à effacer.", "alert-info");
      }
      else{
        RHDialog();
      }

      },
    error: function(data) {
      console.log(data);
    }
  });

})

function RHDialog(){
  bootbox.dialog({
    title: "Effacer l'historique",
    message: "Etes vous sûr de vouloir effacer l'historique ?",
    closeButton: false,
    buttons: {
        cancel: {
            label: "Annuler",
            className: 'btn-default',
        },
        noclose: {
            label: "Sauvegarder",
            className: 'btn-success',
            callback: function(){
                ($('#answers').tableExport({
                  type:'csv',
                  csvSeparator: ';',
                  fileName: 'Watson-Tone-Analyzer-analyses'
                }));
                return false;
            }
        },
        ok: {
            label: "Effacer",
            className: 'btn-danger',
            callback: function(){
                $.ajax({
                  type: 'POST',
                  // url: "AGT",
                  // url: "ACET",
                  url: "RH",
                  dataType: 'json',

                  success: function(data) {
                    $('#answers').bootstrapTable('removeAll');
                    ShowAlert("Historique effacé avec succès.", "", "alert-success");
                  },
                  error: function(data) {
                    console.log(data);
                  }

                });
            }
        }
    }
  });
}


$('#gHistorical').click(function (){

  $.ajax({
    type: 'POST',
    // url: "AGT",
    // url: "ACET",
    url: "GH",
    dataType: 'json',

    success: function(data) {
      if(!data.HISTORICAL || data.HISTORICAL.length == 0){
        ShowAlert("Aucun historique", "Il n'y a rien à afficher.", "alert-info");
      }
      else{
        var rows = [];
        $.each(data.HISTORICAL, function(index, obj){
          rows.push(loadDatas(obj)[0]);
        })

        $('#answers').bootstrapTable('load', rows);
        $('#sentence').val("");
        // $('#send').prop("disabled", true);
      }
    },
    error: function(data) {
      console.log(data);
    }

  });

})

$('#send').click(function (){
  var text = $('#sentence').val();

  if(!$.trim(text)){
    ShowAlert("Il n'y a rien à envoyer.", "Veuillez écrire une phrase.", "alert-warning");
    return;
  }

  var toneInput = {"text": text};

  $.ajax({
    type: 'POST',
    // url: "AGT",
    // url: "ACET",
    url: "AAT",
    dataType: 'json',
    data: JSON.stringify(toneInput),

    success: function(data) {
      if(data.STATUS == "OK" && data.TONES){
        $('#answers').bootstrapTable('append', loadDatas(data));
      }
      else{
        ShowAlert("Erreur de communication avec Watson.", "Veuillez vérifier le paramétrage.", "alert-danger");
        console.log(data);
      }
      $('#sentence').val("");
      // $('#send').prop("disabled", true);
    },
    error: function(data) {
      console.log(data);
    }

  });

})

function loadDatas(data){

  var rows = [];

  rows.push({
      sentence: data.TEXT,
      anger: data.TONES.anger,
      disgust: data.TONES.disgust,
      fear: data.TONES.fear,
      joy: data.TONES.joy,
      sadness: data.TONES.sadness,
      analytical: data.TONES.analytical,
      confident: data.TONES.confident,
      tentative: data.TONES.tentative,
      excited: data.TONES.excited,
      frustrated: data.TONES.frustrated,
      impolite: data.TONES.impolite,
      polite: data.TONES.polite,
      sad: data.TONES.sad,
      satisfied: data.TONES.satisfied,
      sympathetic: data.TONES.sympathetic
  });

  return rows;
}

function buildTable(cols){

  $('#answers').bootstrapTable({
      columns: cols,
      // url: url,
      // data: data,
      showToggle: false,
      search: true,
      onEditableInit: function(){
        //Fired when all columns was initialized by $().editable() method.
      },
      onEditableShown: function(editable, field, row, $el){
        //Fired when an editable cell is opened for edits.
      },
      onEditableHidden: function(field, row, $el, reason){
        //Fired when an editable cell is hidden / closed.
      },
      onEditableSave: function (field, row, oldValue, editable) {
        //Fired when an editable cell is saved.
      },
      onClickCell: function (field, value, row, $element){
      }
  });

}

function ShowAlert(title, message, alertType, area) {

    $('#alertmsg').remove();

    var timeout = 5000;

    if(area == undefined){
      area = "bottom";
    }
    if(alertType.match('alert-warning')){
      area = "bottom";
      timeout = 10000;
    }
    if(alertType.match('alert-danger')){
      area = "bottom";
      timeout = 30000;
    }

    var $newDiv;

    if(alertType.match('alert-success|alert-info')){
      $newDiv = $('<div/>')
       .attr( 'id', 'alertmsg' )
       .html(
          '<h4>' + title + '</h4>' +
          '<p>' +
          message +
          '</p>'
        )
       .addClass('alert ' + alertType + ' flyover flyover-' + area);
    }
    else{
      $newDiv = $('<div/>')
       .attr( 'id', 'alertmsg' )
       .html(
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
          '<h4>' + title + '</h4>' +
          '<p>' +
          '<strong>' + message + '</strong>' +
          '</p>'
        )
       .addClass('alert ' + alertType + ' alert-dismissible flyover flyover-' + area);
    }

    $('#alert').append($newDiv);

    if ( !$('#alertmsg').is( '.in' ) ) {
      $('#alertmsg').addClass('in');

      setTimeout(function() {
         $('#alertmsg').removeClass('in');
      }, timeout);
    }
}

$('#logout').click(function (){
  logout();
})

function logout(){

  $('#modLogout').modal('toggle');

  return;
}
