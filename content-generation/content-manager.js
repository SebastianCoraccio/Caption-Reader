const readline = require('readline');
const s3 = require('./s3');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }),
  );
}

async function addVideo() {
  const currentManifest = await s3.downloadFromS3({file: '.manifest.json'});

  console.log('The current categories are:');
  currentManifest.forEach((category, index) =>
    console.log(`${index + 1}. ${category.title}`),
  );
  console.log(`${currentManifest.length + 1}. Add new category`);

  // TODO the case where there are no categories is not handled

  const category = Number(
    await askQuestion('Which category would you like to add to?\n'),
  );

  // TODO this would be nice to have a helper function for
  if (isNaN(category) || category < 0 || category > category.length) {
    return;
  }

  if (category === currentManifest.length + 1) {
    console.log('Creating a new category');
    await addCategory(currentManifest);
  } else {
    console.log('Selected', currentManifest[category - 1].title);
  }
}

async function addCategory(currentManifest) {
  const categoryName = await askQuestion(
    'What is the new category called? Use kebab case i.e. complete-beginner\n',
  );
}

async function main() {
  const ans = await askQuestion(`Which would you like to do?
  1. Add video
  2. Remove video
  3. Remove category
`);

  switch (ans) {
    case '1': {
      await addVideo();
      break;
    }
    case '2': {
      console.log("This hasn't been implemented yet.\nBye!");
      break;
    }
    case '3': {
      console.log("This hasn't been implemented yet.\nBye!");
      break;
    }
    default: {
      console.log(
        "\nI don't recognize that option. Please enter the number of the option you'd like",
      );
      main();
    }
  }
}
main();
