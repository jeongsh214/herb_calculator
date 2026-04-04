let total = 0;
let resultMap = {};

const IMG_PATH = "items/";

const scoreMap = {
  A: 1,
  B: 2,
  C: 3,
  S: 4,
};

const groupLabels = {
  A: "A그룹",
  B: "B그룹",
  C: "C그룹",
  S: "S그룹",
};

const items = {
  A: [
    { src: IMG_PATH + "a1.png", name: "녹태" },
    { src: IMG_PATH + "a2.png", name: "민들레" },
    { src: IMG_PATH + "a3.png", name: "생강" },
    { src: IMG_PATH + "a4.png", name: "영군버섯" },
    { src: IMG_PATH + "a5.png", name: "옥취엽" },
  ],
  B: [
    { src: IMG_PATH + "c1.png", name: "백향초" },
    { src: IMG_PATH + "c2.png", name: "자운초" },
    { src: IMG_PATH + "c3.png", name: "적주과" },
    { src: IMG_PATH + "c4.png", name: "황초" },
    { src: IMG_PATH + "c5.png", name: "흑성과" },
  ],
  C: [
    { src: IMG_PATH + "b1.png", name: "권엽" },
    { src: IMG_PATH + "b2.png", name: "금양광초" },
    { src: IMG_PATH + "b3.png", name: "옥향초" },
    { src: IMG_PATH + "b4.png", name: "인삼" },
    null,
  ],
  S: [
    { src: IMG_PATH + "s1.png", name: "금향과" },
    { src: IMG_PATH + "s2.png", name: "빙백설화" },
    { src: IMG_PATH + "s3.png", name: "월계엽" },
    { src: IMG_PATH + "s4.png", name: "철목영지" },
    { src: IMG_PATH + "s5.png", name: "홍련업화" },
  ],
};

const groupsContainer = document.getElementById("groupsContainer");
const totalEl = document.getElementById("total");
const resultEl = document.getElementById("result");

function renderItems() {
  for (const group in items) {
    const row = document.createElement("div");
    row.className = "group-row";

    const title = document.createElement("div");
    title.className = "group-title";
    title.innerText = groupLabels[group];

    const itemArea = document.createElement("div");
    itemArea.className = "group-items";

    items[group].forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "item";

      if (!item) {
        const empty = document.createElement("div");
        empty.className = "empty";
        wrapper.appendChild(empty);

        const emptyLabel = document.createElement("div");
        emptyLabel.className = "label";
        emptyLabel.innerText = "";
        wrapper.appendChild(emptyLabel);

        itemArea.appendChild(wrapper);
        return;
      }

      const imageBox = document.createElement("div");
      imageBox.className = "image-box";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.name;
      img.dataset.group = group;
      img.onclick = () => toggleItem(img);

      const label = document.createElement("div");
      label.className = "label";
      label.innerText = item.name;

      imageBox.appendChild(img);
      wrapper.appendChild(imageBox);
      wrapper.appendChild(label);
      itemArea.appendChild(wrapper);
    });

    row.appendChild(title);
    row.appendChild(itemArea);
    groupsContainer.appendChild(row);
  }
}

async function loadCSV() {
  try {
    const response = await fetch("./results.csv");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    const rows = lines.slice(1);

    resultMap = {};

    rows.forEach((line) => {
	const [score, result, color] = line.split(",");
	if (score && result) {
		resultMap[score.trim()] = {
		text: result.trim(),
		color: (color || "#000000").trim(),
		};
	}
	});

    updateResult();
  } catch (error) {
    console.error("CSV 로드 실패:", error);
    resultEl.innerText = "CSV 오류";
  }
}

function toggleItem(element) {
  const group = element.dataset.group;
  const score = scoreMap[group];
  const selectedCount = document.querySelectorAll("img.selected").length;
  const wrapper = element.parentElement.parentElement; // .item
  const imageBox = element.parentElement; // .image-box

  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
    wrapper.classList.remove("selected-item");
    imageBox.classList.remove("selected");
    total -= score;
  } else {
    if (selectedCount >= 5) return;

    element.classList.add("selected");
    wrapper.classList.add("selected-item");
    imageBox.classList.add("selected");
    total += score;
  }

  totalEl.innerText = total;
  updateResult();
}

function updateResult() {
  const selectedCount = document.querySelectorAll("img.selected").length;

  if (selectedCount < 3) {
    resultEl.innerText = "-";
    resultEl.style.color = "#000000";
    return;
  }

  const data = resultMap[String(total)];

  if (data) {
    resultEl.innerText = data.text;
    resultEl.style.color = data.color;
  } else {
    resultEl.innerText = "-";
    resultEl.style.color = "#000000";
  }
}

function reset() {
  total = 0;
  totalEl.innerText = total;

  resultEl.innerText = "-";
  resultEl.style.color = "#000000";

  document.querySelectorAll("img").forEach((img) => {
    img.classList.remove("selected");
  });

  document.querySelectorAll(".item").forEach((item) => {
    item.classList.remove("selected-item");
  });

  document.querySelectorAll(".image-box").forEach((box) => {
    box.classList.remove("selected");
  });
}

renderItems();
loadCSV();