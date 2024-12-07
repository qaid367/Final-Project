const defaultElement = document.querySelector("#original");
window.addEventListener("mouseover", (event) => {
  const element = event.target;
  if (element.tagName != "A" && !defaultElement.classList.contains("current")) {
    const anchorElements = document.querySelectorAll(".nav-content a");
    anchorElements.forEach((a) => {
      a.classList.remove("current");
    });
    defaultElement.classList.add("current");
  }
  if (element.tagName == "A") {
    const activeElement = document.querySelector(".current");
    activeElement.classList.remove("current");
    element.classList.add("current");
  }
});
