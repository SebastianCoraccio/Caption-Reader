const readline = require('readline');
const {downloadFromS3, uploadDataToS3} = require('./s3');

// I normally don't prefer using globals, but a CLI tool
// seems like a decent use case
let folderManifest = [];

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

async function selectCategory() {
  if (folderManifest.length === 0) {
    console.log('No categories have been created yet. Please make one.');
    await addCategory();
  }

  console.log('The current categories are:');
  folderManifest.forEach((category, index) =>
    console.log(`${index + 1}. ${category.title}`),
  );
  console.log(`${folderManifest.length + 1}. Add new category`);

  const category = Number(
    await askQuestion('Which category would you like to add to?\n'),
  );

  // TODO this would be nice to have a helper function for
  if (isNaN(category) || category < 0 || category > category.length) {
    return;
  }

  if (category === folderManifest.length + 1) {
    console.log('Creating a new category');
    await addCategory();
  }

  console.log('Selected', folderManifest[category - 1].title);
  return folderManifest[category - 1].title;
}

async function addCategory() {
  const categoryName = await askQuestion(
    'What is the new category called? Use kebab case i.e. complete-beginner\n',
  );

  folderManifest.push({title: `${categoryName}/`, type: 'folder'});
  await uploadDataToS3({
    key: '.manifest.json',
    data: folderManifest,
  });
}

async function setup() {
  try {
    folderManifest = await downloadFromS3({file: '.manifest.json'});
  } catch (err) {}
}

async function main() {
  await setup();

  const ans = await askQuestion(`Which would you like to do?
  1. Add video
  2. Remove video
  3. Remove category
`);

  switch (ans) {
    case '1': {
      const category = await selectCategory();
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
