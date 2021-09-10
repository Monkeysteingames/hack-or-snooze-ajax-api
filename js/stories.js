"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

function checkIfFavorite(story, user) {
  console.log(user.favorites.length)
  for (let i = 0; i < user.favorites.length; i++) {
    if (story.storyId == user.favorites[i].storyId) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  //Check if we're logged into an account, if not then we'll just generate the stories without checking for favorites
  if (currentUser) {
    //Compare story ids from story to user favorites and sets favorite box checked if true
    for (let i = 0; i < currentUser.favorites.length; i++) {
      if (story.storyId == currentUser.favorites[i].storyId) {
        return $(`
    <li id="${story.storyId}">
    <input type="checkbox" class="star" checked>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
      }
    }
  }
  return $(`
  <li id="${story.storyId}">
  <input type="checkbox" class="star" >
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
`);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Get list of favorite stories from user storage, generates their HTML, and puts on page */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of user favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function createNewStoryAndAddToPage() {
  //hide the submit form
  $($newSubmitForm).hide()

  //grab the values from the form
  let url = $formSubmitUrl.val();
  let title = $formSubmitTitle.val();
  let author = $formSubmitAuthor.val();

  //run the add story method from the static class using the values above and currentUser
  await storyList.addStory(currentUser,
    { title: title, author: author, url: `http://${url}` });

  //run getAndShowStoriesOnStart() method to refresh stories on page
  getAndShowStoriesOnStart();
}

$formSubmitButton.on('click', createNewStoryAndAddToPage);

