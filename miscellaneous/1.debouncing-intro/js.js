const searchInput = document.getElementById("sample-input");

const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};
const onSearch = (searchedValue) => {
  console.log(searchedValue);
};

const debouncedOnSearch = debounce(onSearch, 700);

searchInput.addEventListener("keyup", (e) => debouncedOnSearch(e.target.value));
