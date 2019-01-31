// Topic variables

var topics = [
	{
		topic: "lazy",
		search: "lazy"
	},
  {
      topic: "all the way up",
      search: "all+the+way+up"
  },
  {
      topic: "i can't even",
      search: "i+cant+even"
  },
  {
      topic: "wat",
      search: "wat"
  },
  {
      topic: "i will kill you",
      search: "i+will+kill+you"
  },
  {
      topic: "suggestive eyebrows",
      search: "suggestive+eyebrows"
  },
  {
      topic: "uhhh",
      search: "uhhh"
  }
];

// User input variables


// Function to call for loop and generate 10 gifs

function makeGifs(gifs, searchTerm) {
    $("#gif-section").empty();

    for (const i of gifs) {
        var still = i.images.fixed_width_still.url;
        var animate = i.images.fixed_width.url;
        var rating = i.rating;

        var $newGif = $("<div/>").attr("class", "gif-box well");
        var $gifElement = $("<img>").attr({"src": still, "data-animate": animate, "data-still": still, "class": "giphy", "alt": searchTerm});
        var $copyButton = $("<button/>").attr({"class": "btn btn-info btn-xs copy-gif", "data-clipboard-text": animate}).text("Copy Link");
        $newGif.html('<p class="label label-warning">Rating: ' + rating + "</p><br><br>" + $gifElement[0].outerHTML + "<br><br>" + $copyButton[0].outerHTML);
        $("#gif-section").append($newGif);
    }
}

// Loop through topics array to display buttons

function showButtons() {

    if ($("#button-section").children().length > 0) {
        var $button = $("<button/>").attr({"data-topic": topics[topics.length - 1].search, "class": "search-term btn btn-default"}).html(topics[topics.length - 1].topic);
        $("#button-section").append($button);
    } else {
        for (const item of topics) {
            var $button = $("<button/>").attr({"data-topic": item.search, "class": "search-term btn btn-default"}).html(item.topic);
            $("#button-section").append($button);
        }
    }
}

showButtons();

// Query the API when someone clicks a button or adds a button

function queryAPI(searchTerm) {
    var apiKey = "&api_key=dc6zaTOxFJmzC";
    var queryURL = "http://api.giphy.com/v1/gifs/search?";
    queryURL += "q=" + searchTerm + "&limit=10" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(result) {
        var gifs = result.data;
        makeGifs(gifs, searchTerm);
    }).fail(function(error) {
        console.log(error);
        alert("Something went wrong. Try your request again!");
    });
}

// When someone clicks on button, pull search term and query Giphy API to pull 10 corresponding GIFs

$(document).on("click", ".search-term", function() {
    var searchTerm = $(this).data("topic");
    queryAPI(searchTerm);
});

// When someone clicks on still GIF image, animate it

$(document).on("click", "img.giphy", function() {
    var stillData = $(this).data("still");
    var animateData = $(this).data("animate");
    var currentSrc = $(this).attr("src");

    if (currentSrc === stillData) {
        $(this).attr("src", animateData);
    } else {
        $(this).attr("src", stillData);
    }
});

// Allow user to add a search term and automatically pull up GIFs for that term once it's added

$("#add-button").on("click", function(event) {
    event.preventDefault();
    var newTerm = $("#new-search").val().trim();
    $("#new-search").val("");

    function parseSearch() {
        var str = newTerm;
        str = str.replace(/'/g, '');
        var parsedTerm = str.split(" ");
        return parsedTerm.join("+");
    }

    var parsedTerm = parseSearch();
    var newSearch = {
        topic: newTerm,
        search: parsedTerm
    };

    topics.push(newSearch);
    showButtons();
    queryAPI(parsedTerm);
});

// Copy GIF URL to user's clipboard when they click on button below GIF image

new Clipboard (".copy-gif");
