(function() {
  'use strict';

  // var results = rawCharlestonData.results;

  $(document).ready(function() {

    //
    // links html element div with .results-list class
    //
    var $list = $('.results-list');
    var sortedBy = "score";

    //
    // Listen for Button Click and create new search term URL
    //
    $("button").on("click", updateURL);

    function updateURL() {
      var searchTerm = "https://api.etsy.com/v2/listings/active.js?api_key=cdwxq4soa7q4zuavbtynj8wx&keywords=" + $(".search-term").val().replace(/ /g, '+') + "&includes=Images,Shop&sort_on=" + sortedBy + "&limit=9";

      //
      // Get JSON data from Etsy
      //
      $.ajax({
        url: searchTerm,
        type: "GET",
        dataType: 'jsonp'
      }).done(function(updatedResults) {
        if ($(".dropdown option:selected").text() == "Lowest Price") {
          updatedResults.results = updatedResults.results.reverse();
        }
        renderListings(updatedResults.results);

      });
      //
      // Sort Dropdown
      //

      $(".dropdown").change(function(sortStuff) {

        if ($(".dropdown option:selected").text() == "Lowest Price") {
          sortedBy = "price&sort_order=up";
        } else if ($(".dropdown option:selected").text() == "Highest Price") {
          sortedBy = "price&sort_order=down";
        } else if ($(".dropdown option:selected").text() == "Relevance") {
          sortedBy = "score";

        }
        updateURL();

      });

    }

    function renderListings(data) {
      $list.empty();
      data.forEach(function(result) {
        var resultText = renderTemplate('results-item', {
          title: result.title,
          cost: result.price,
          shop: result.Shop.shop_name,
          image: result.Images[0].url_170x135,
          url: result.url,
          currency: result.Shop.currency_code
        });
        $list.append(resultText);
      });
    }

  });

  function renderTemplate(name, data) {
    var $template = $('[data-template-name=' + name + ']').text();
    $.each(data, function(prop, value) {
      $template = $template.replace('<% ' + prop + ' %>', value);
    });
    return $template;
  }

})();