const API_URL = "http://localhost:8787/generatePower"; // replace with your deployed backend URL

const btn = document.getElementById("generateBtn");
const input = document.getElementById("promptInput");
const brainstormBox = document.getElementById("brainstorm");

btn.onclick = async () => {
  const prompt = input.value.trim();
  if (!prompt) return;

  brainstormBox.innerText = "⏳ Generating...";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  try {
    const json = JSON.parse(data.output.match(/\{[\s\S]*\}/)[0]); // extract JSON
    brainstormBox.innerText = data.output.split("{")[0].trim(); // show brainstorm
    window.currentPower = json;
  } catch (e) {
    brainstormBox.innerText = "⚠️ Failed to parse AI output.";
  }
};
