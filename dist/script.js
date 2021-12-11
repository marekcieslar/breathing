// calculate how many percent is first number from second number
function percent(a, b) {
  return (a / b) * 100;
}

const breathsCircle = document.querySelector('.breaths__circle');
const btnStart = document.getElementById('button-start');
const btnBreathsStop = document.getElementById('breaths-button-stop');
const stylesheet = document.styleSheets[0];
const breathsCount = document.getElementById('breaths-count');
const btnHoldBreathStop = document.getElementById('hold-breath-button-stop');
const holdBreathTimer = document.getElementById('hold-breath-timer');
const resultsBody = document.getElementById('results-body');
const results = [];
let breathInterval = null;
let holdBreathInterval = null;
let holdBreathTime = 0;

const settings = {
  breathCount: document.getElementById('settings-breath-count'),
  breathTimeIn: document.getElementById('settings-breath-time-in'),
  breathTimeOut: document.getElementById('settings-breath-time-out'),
  breathBreakEmpty: document.getElementById('settings-breath-break-empty'),
  breathBreakFull: document.getElementById('settings-breath-break-full'),
};

btnStart.addEventListener('click', () => {
  const breathCount = settings.breathCount.value;

  const { time, firstBreak, secondBreak, thirdBreak } = countSettings(settings);

  console.log({ time, firstBreak, secondBreak, thirdBreak });

  stylesheet.cssRules[0][0].keyText = `${firstBreak}%`;
  stylesheet.cssRules[0][1].keyText = `${secondBreak}%`;
  stylesheet.cssRules[0][2].keyText = `${thirdBreak}%`;

  console.log(stylesheet);

  breathsCircle.style.animationIterationCount = breathCount;
  breathsCircle.style.animationDuration = `${time}s`;
  breathsCircle.style.animationName = 'circleMove';

  updateBreathCount(Number(breathCount), time);
});

btnBreathsStop.addEventListener('click', () => {
  breathsCircle.style.animationName = 'none';
  if (breathInterval) {
    clearInterval(breathInterval);
    breathsCount.innerText = 0;
  }
});

function countSettings(settingsObject) {
  const breathBreakEmpty = Number(settingsObject.breathBreakEmpty.value);
  const breathTimeIn = Number(settingsObject.breathTimeIn.value);
  const breathBreakFull = Number(settingsObject.breathBreakFull.value);
  const breathTimeOut = Number(settingsObject.breathTimeOut.value);

  const time =
    breathTimeIn + breathTimeOut + breathBreakEmpty + breathBreakFull;
  const firstBreak = percent(breathBreakEmpty, time);
  const secondBreak = percent(breathBreakEmpty + breathTimeIn, time);
  const thirdBreak = percent(
    breathBreakEmpty + breathTimeIn + breathBreakFull,
    time
  );

  return {
    time,
    firstBreak,
    secondBreak,
    thirdBreak,
  };
}

function updateBreathCount(breathsNumber, breathTime) {
  breathsNumber--;
  breathsCount.innerText = breathsNumber;
  breathInterval = setInterval(() => {
    if (breathsNumber > 0) {
      breathsNumber--;
      breathsCount.innerText = breathsNumber;
    } else {
      breathsCircle.style.animationName = 'none';
      clearInterval(breathInterval);
      breathsCount.innerText = 0;
      holdBreathStartTimer();
    }
  }, breathTime * 1000);
}

function holdBreathStartTimer() {
  holdBreathTime = 0;
  holdBreathInterval = setInterval(() => {
    holdBreathTime += 0.1;
    holdBreathTimer.innerText = holdBreathTime.toFixed(1);
  }, 100);
}

function holdBreathStopTimer() {
  if (holdBreathInterval) {
    clearInterval(holdBreathInterval);
  }
  const timestamp = Date.now();
  time = holdBreathTime.toFixed(1);
  results.push({ time });
  addResultRow(results.length, time);
  holdBreathTimer.innerText = '';
}

btnHoldBreathStop.addEventListener('click', holdBreathStopTimer);

function addResultRow(id, time) {
  const row = document.createElement('tr');
  row.classList.add('results__row');
  row.innerHTML = `<td>${id}</td><td>${time} s.</td>`;
  resultsBody.appendChild(row);
}
