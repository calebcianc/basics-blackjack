// Global variables
var gameStage = "intro";
var playerStage = "hitOrStand";
var numberOfPlayers = 1;
var listOfParticipants = [];
var shuffledDeck = [];
var allParticipantsCards = [];
var currentParticipantIndex = 0;
var betCounter = 0;
var currentParticipantHand = [];
var dealerHand = [];
var participantValues = []; // Stores value of participants' hands
var storedMessages = [];
var message = "";
var listOfBets = [];
var listOfPoints = [];
var displayMessageToggle = 0;
var submit = `</br></br><i>Click 'submit' to continue.</i>`;

// Change player stage to hit OR stand depending on button click
function changePlayerStage(input) {
  if (input == "hit") {
    playerStage = "hit";
  } else if (input == "stand") {
    playerStage = "stand";
  } else if (input == "hitOrStand") {
    playerStage == "hitOrStand";
  }
}

// Enable/disable buttons based on stage
function toggleHitStandButtons(input) {
  if (input == "on") {
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
    document.getElementById("submit-button").disabled = true;
  } else if (input == "off") {
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("submit-button").disabled = false;
  }
}

// Generate list of participants and points based on number of players
function generateListOfParticipants(numberOfPlayers) {
  var counter = 1;
  while (counter <= numberOfPlayers) {
    listOfParticipants.push("Player " + counter);
    listOfPoints.push(Number(100));
    counter += 1;
  }
  listOfParticipants.push("Dealer");
  listOfPoints.push(Number(100));
  console.log(
    `listOfParticipants: ${listOfParticipants},listOfPoints: ${listOfPoints}`
  );
}

// Generate deck of 52 cards with respective values
function makeDeck() {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ["♥️", "♦️", "♣️", "♠️"];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;
      var cardValue = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = "Ace of ";
      } else if (cardName == 11) {
        cardName = "Jack of ";
        cardValue = 10;
      } else if (cardName == 12) {
        cardName = "Queen of ";
        cardValue = 10;
      } else if (cardName == 13) {
        cardName = "King of ";
        cardValue = 10;
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        value: cardValue,
      };

      // Add the new card to the deck
      cardDeck.push(card);

      // Increment rankCounter to iterate over the next rank
      rankCounter += 1;
    }

    // Increment the suit index to iterate over the next suit
    suitIndex += 1;
  }

  // Return the completed card deck
  return cardDeck;
}

// Get a random index ranging from 0 (inclusive) to max (exclusive).
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Shuffle the elements in the cardDeck array
function shuffleCards(cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
}

// Deal 2 cards from top of deck to each participant
function dealCards(shuffledDeck) {
  var counter = 0;
  while (counter <= numberOfPlayers) {
    var dealtCards = [];
    dealtCards.push(shuffledDeck.pop());
    dealtCards.push(shuffledDeck.pop());
    allParticipantsCards[counter] = dealtCards;
    counter += 1;
  }
}

// Show results with player's hand throughout game
function displayMessage() {
  if (displayMessageToggle == 0) {
    var counter = 0;
    var displayMessage = "";
    while (counter < storedMessages.length) {
      displayMessage += `${storedMessages[counter]}</br>`;
      counter += 1;
    }
    return displayMessage;
  } else if (displayMessageToggle == 1) {
    return generateResultsMessage();
  } else if (displayMessageToggle == 2) {
    return "";
  }
}

// Show scoreboard throughout game
function displayScoreboard() {
  var counter = 0;
  var displayScoreboard = "";
  while (counter <= numberOfPlayers) {
    displayScoreboard += `${listOfParticipants[counter]}: $${listOfPoints[counter]}</br>`;
    counter += 1;
  }
  return displayScoreboard;
}

// Ask participants for bets before the start of each game
function getBets(input) {
  var message = "";
  if (input == "") {
    listOfBets = [];
    document.getElementById("floatingInputGrid").disabled = false;
    message = `${listOfParticipants[betCounter]}, how much would you like to bet?`;
    betCounter += 1;
    return message;
  }
  listOfBets.push(Number(input));
  console.log("listOfBets: ", listOfBets);
  if (betCounter < numberOfPlayers) {
    message = `${listOfParticipants[betCounter]}, how much would you like to bet?`;
    betCounter += 1;
    return message;
  } else {
    gameStage = "newGame";
    document.getElementById("floatingInputGrid").disabled = true;
    return `All bets collected! ${submit}`;
  }
}

// Show results with Win/Lose at game end
function generateResultsMessage() {
  var counter = 0;
  var resultsMessage = "";
  while (counter < currentParticipantIndex) {
    if (participantValues[counter] >= 22) {
      resultsMessage += storedMessages[counter];
      listOfPoints[counter] = listOfPoints[counter] - listOfBets[counter];
      listOfPoints[numberOfPlayers] =
        listOfPoints[numberOfPlayers] + listOfBets[counter];
    } else if (participantValues[numberOfPlayers] >= 22) {
      if (participantValues[counter] == 21) {
        resultsMessage += `${storedMessages[counter]} - Player won and gains 1.5x $${listOfBets[counter]}!`;
        listOfPoints[counter] =
          listOfPoints[counter] + 1.5 * listOfBets[counter];
        listOfPoints[numberOfPlayers] =
          listOfPoints[numberOfPlayers] - 1.5 * listOfBets[counter];
      } else if (participantValues[counter] <= 20) {
        resultsMessage += `${storedMessages[counter]} - Player won and gains $${listOfBets[counter]}!`;
        listOfPoints[counter] = listOfPoints[counter] + listOfBets[counter];
        listOfPoints[numberOfPlayers] =
          listOfPoints[numberOfPlayers] - listOfBets[counter];
      }
    } else if (
      participantValues[counter] == participantValues[numberOfPlayers]
    ) {
      resultsMessage += `${storedMessages[counter]} and tied with the dealer; netiher won nor lost $${listOfBets[counter]}!`;
    } else if (
      participantValues[counter] < participantValues[numberOfPlayers]
    ) {
      resultsMessage += `${storedMessages[counter]} - Player lost and loses $${listOfBets[counter]}!`;
      listOfPoints[counter] = listOfPoints[counter] - listOfBets[counter];
      listOfPoints[numberOfPlayers] =
        listOfPoints[numberOfPlayers] + listOfBets[counter];
    } else if (
      participantValues[counter] > participantValues[numberOfPlayers]
    ) {
      resultsMessage += `${storedMessages[counter]} - Player won and gains $${listOfBets[counter]}!`;
      listOfPoints[counter] = listOfPoints[counter] + listOfBets[counter];
      listOfPoints[numberOfPlayers] =
        listOfPoints[numberOfPlayers] - listOfBets[counter];
    }
    resultsMessage += `</br>`;
    counter += 1;
  }
  resultsMessage += storedMessages[currentParticipantIndex];
  return resultsMessage;
}

// When player hits, deal one more card and calculate value
function playerHit() {
  allParticipantsCards[currentParticipantIndex].push(shuffledDeck.pop());
  currentParticipantHand.push(
    allParticipantsCards[currentParticipantIndex][currentParticipantHand.length]
      .name +
      allParticipantsCards[currentParticipantIndex][
        currentParticipantHand.length
      ].suit
  );
}

// When player stands, end player's turn
function playerStand() {
  var valueOfHand = calcValueOfHand();
  participantValues.push(valueOfHand);
  var message = `You have chosen to stand. The value of your hand is ${valueOfHand}.${submit}`;
  var storeMessage = `${listOfParticipants[currentParticipantIndex]} drew ${currentParticipantHand} with a value of ${valueOfHand}`;
  storedMessages.push(storeMessage);
  resetAndPrepareTurn();
  haveAllPlayersCompleted();
  return message;
}

// During dealer's turn, check for value of hand and return accordingly
function dealersTurn() {
  var valueOfHand = calcValueOfHand();
  message = `The dealer's hand is ${currentParticipantHand} with a value of ${valueOfHand}`;
  if (valueOfHand <= 16) {
    message = message + " - The dealer will now hit.";
    playerHit();
  } else if (valueOfHand >= 17 && valueOfHand <= 21) {
    message = message + " - The dealer will now stand.";
    participantValues.push(valueOfHand);
    var storeMessage = `${listOfParticipants[currentParticipantIndex]} drew ${currentParticipantHand} with a value of ${valueOfHand}`;
    storedMessages.push(storeMessage);
    gameStage = "showResults";
  } else if (valueOfHand > 21) {
    message = message + " - <b>The dealer bust!</b>";
    participantValues.push(valueOfHand);
    var storeMessage = `${listOfParticipants[currentParticipantIndex]} drew ${currentParticipantHand} with a value of ${valueOfHand} - The dealer bust!`;
    storedMessages.push(storeMessage);
    gameStage = "showResults";
  }
  return `${message} ${submit}`;
}

// Returns "true" if ace is present
function trueIfAce() {
  var counter = 0;
  var noOfAce = 0;
  while (counter < allParticipantsCards[currentParticipantIndex].length) {
    if (
      allParticipantsCards[currentParticipantIndex][counter].name == "Ace of "
    ) {
      noOfAce += 1;
    }
    counter += 1;
  }
  return noOfAce != 0;
}

// For current participant, calculate the sum of the value of his hand. Adds 10 to value when ace is present and when it does not make the player go bust
function calcValueOfHand() {
  counter = 0;
  var sum = 0;
  while (counter < currentParticipantHand.length) {
    sum += allParticipantsCards[currentParticipantIndex][counter].value;
    counter += 1;
  }
  if (trueIfAce() && sum <= 11) {
    sum += 10;
  }
  return sum;
}

// Checks value to see if player busts. To end player's turn if bust.
function checkIfBust() {
  var valueOfHand = calcValueOfHand();
  if (valueOfHand <= 21) {
    var drawnMessage = `Hi <b>${listOfParticipants[currentParticipantIndex]}</b>, the dealer's first card is ${dealerHand}.</br>Your cards are ${currentParticipantHand} with a value of ${valueOfHand}.</br></br>Would you like to Hit or Stand?`;
    toggleHitStandButtons("on");
    return drawnMessage;
  } else if (valueOfHand > 21) {
    var drawnMessage = `Your cards are ${currentParticipantHand} with a value of ${valueOfHand} - <b>You bust!</b>${submit}`;
    var storeMessage = `${listOfParticipants[currentParticipantIndex]} drew ${currentParticipantHand} with a value of ${valueOfHand} - Player busts and lost $${listOfBets[currentParticipantIndex]}!`;
    storedMessages.push(storeMessage);
    participantValues.push(valueOfHand);
    resetAndPrepareTurn();
    haveAllPlayersCompleted();
    toggleHitStandButtons("off");
    return drawnMessage;
  }
}

// Once a player ends, reset and prepare turn for next player
function resetAndPrepareTurn() {
  currentParticipantIndex += 1;
  currentParticipantHand = []; // resets current participant hand
  generateCurrentParticipantHand();
}

// Check if all players have completed their turn. If no, set playerStage to "hitOrStand". If yes, set gameStage to "dealerTurn"
function haveAllPlayersCompleted() {
  if (currentParticipantIndex < Number(listOfParticipants.length - 1)) {
    playerStage = "hitOrStand";
  } else if (currentParticipantIndex == Number(listOfParticipants.length - 1)) {
    gameStage = "dealerTurn";
    dealerHand.push(
      allParticipantsCards[numberOfPlayers][1].name +
        allParticipantsCards[numberOfPlayers][1].suit
    );
  }
}

// For current participant, push details of his hand into an array
function generateCurrentParticipantHand() {
  currentParticipantHand.push(
    allParticipantsCards[currentParticipantIndex][0].name +
      allParticipantsCards[currentParticipantIndex][0].suit
  );
  currentParticipantHand.push(
    allParticipantsCards[currentParticipantIndex][1].name +
      allParticipantsCards[currentParticipantIndex][1].suit
  );
}

// Empties arrays for new game
function getReadyForNewGame() {
  playerStage = "hitOrStand";
  allParticipantsCards = [];
  currentParticipantHand = [];
  dealerHand = [];
  currentParticipantIndex = 0;
  storedMessages = [];
  shuffledDeck = shuffleCards(makeDeck());
  dealCards(shuffledDeck);
  dealerHand.push(
    allParticipantsCards[numberOfPlayers][0].name +
      allParticipantsCards[numberOfPlayers][0].suit
  );
}

// Main function
function main(numberOfPlayersInput, betAmountInput) {
  message =
    "Oops I think you're missing something. Please input number of players.";
  if (gameStage == "intro" && numberOfPlayersInput != "") {
    numberOfPlayers = Number(numberOfPlayersInput);
    generateListOfParticipants(numberOfPlayers);
    document.getElementById("players-field").disabled = true;
    var message = `Welcome ${listOfParticipants}!${submit}`;
    gameStage = "getBets";
    return message;
  }
  if (gameStage == "getBets") {
    displayMessageToggle = 2;
    return getBets(betAmountInput);
  }
  if (gameStage == "newGame") {
    getReadyForNewGame();
    generateCurrentParticipantHand();
    var message = `Hi <b>${listOfParticipants[currentParticipantIndex]}</b>, the dealer's first card is ${dealerHand}.</br></br><i>Click 'submit' to see your cards.</i>`;
    gameStage = "playerTurn";
  }
  if (gameStage == "playerTurn" && playerStage == "hitOrStand") {
    displayMessageToggle = 0;
    valueOfHand = calcValueOfHand();
    var message = `Hi <b>${listOfParticipants[currentParticipantIndex]}</b>, the dealer's first card is ${dealerHand}.</br>Your cards are ${currentParticipantHand} with a value of ${valueOfHand}.</br></br>Would you like to Hit or Stand?`;
    toggleHitStandButtons("on");
    return message;
  }
  if (gameStage == "playerTurn" && playerStage == "hit") {
    playerHit();
    return checkIfBust();
  }
  if (gameStage == "playerTurn" && playerStage == "stand") {
    toggleHitStandButtons("off");
    return playerStand();
  }
  if (gameStage == "dealerTurn") {
    toggleHitStandButtons("off");
    return dealersTurn();
  }
  if (gameStage == "showResults") {
    message = `The game is now over!</br></br><i>Click 'submit' to start a new game.</i>`;
    gameStage = "getBets";
    betCounter = 0;
    displayMessageToggle = 1;
    return message;
  }
  return message;
}
