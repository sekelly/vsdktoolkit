let signatureEndpoint = "https://l1sgnx6bek.execute-api.us-east-1.amazonaws.com/latest";
let sessionName = "toolkit";
let sessionPasscode = "123";
let userName = "Participant" + Math.floor(Math.random() * 100);
let role = 1;

let UIToolkitConfig;
let UIToolkit = document.createElement("app-uitoolkit");

let featureCheckboxes = document.querySelectorAll("input[type=checkbox][name=feature-settings]");
let enabledFeatureSettings = ['audio', 'video', 'share']

//modal
const featuresModal = new bootstrap.Modal(document.getElementById("featuresModal"));

function getSignature() {
  document.querySelector("#landing").style.display = "none";

  console.log(
    JSON.stringify({
      userName: userName,
      sessionName: sessionName,
      sessionPasscode: sessionPasscode,
      features: enabledFeatureSettings
    })
  );

  fetch(signatureEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionName: sessionName,
      sessionPasscode: sessionPasscode,
      role: role,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.signature);
      joinSession(data.signature);
    })
    .catch((error) => {
      console.log(error);
    });
}

function joinSession(signature) {
  UIToolkitConfig = JSON.stringify({
    videoSDKJWT: signature,
    sessionName: sessionName,
    userName: userName,
    sessionPasscode: sessionPasscode,
    UiKitFeatures: enabledFeatureSettings
  });
  console.log(UIToolkitConfig);

  UIToolkit.setAttribute("uitoolkitconfig", UIToolkitConfig);
  document.getElementById("UIToolkit")?.append(UIToolkit);
  document.querySelector("#session").style.display = "flex";

  window.UIkitSubscribe("uikit-destroy", () => {
    console.log('UI Toolkit ended')
    location.reload(true);
  })
}


featureCheckboxes.forEach(function(featureCheckbox) {
  featureCheckbox.addEventListener('change', function() {
    enabledFeatureSettings = 
      Array.from(featureCheckboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.
    console.log(enabledFeatureSettings)
  })
});

