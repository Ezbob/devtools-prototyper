var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let LibrariesMenu = React.createClass({
  mixins: [Togglable, Menu],
  render() {
    let results = this.state.results.map(function (value, index) {
      return React.createElement(LibrariesItem, _extends({ ref: `item-${ index }`, key: index }, value));
    });
    let injected = this.state.injected.map(function (value, index) {
      return React.createElement(LibrariesItem, _extends({}, value, { injected: true }));
    });

    let resultsClassName = this.state.results.length ? "results" : "";
    let menuClassName = this.menuClassName;
    let className = resultsClassName + " " + menuClassName;

    return React.createElement(
      "div",
      { id: "libraries-menu", className: className },
      React.createElement(
        "div",
        { className: "devtools-toolbar" },
        React.createElement("input", { type: "search", className: "devtools-searchinput", ref: "search",
          placeholder: L10N.getStr("prototyper.libs.search"), onInput: this.search })
      ),
      React.createElement(
        "b",
        null,
        L10N.getStr("prototyper.libs.results")
      ),
      React.createElement(
        "div",
        { ref: "results", id: "libraries-search-results",
          "data-placeholder": L10N.getStr("prototyper.libs.noneFound") },
        results
      ),
      React.createElement("div", { className: "separator" }),
      React.createElement(
        "b",
        null,
        L10N.getStr("prototyper.libs.injected")
      ),
      React.createElement(
        "div",
        { ref: "injected", id: "injected-libs", "data-placeholder": L10N.getStr("prototyper.libs.noneInjected") },
        injected
      )
    );
  },
  getInitialState() {
    return {
      results: [],
      injected: []
    };
  },
  search() {
    var _this = this;

    const cdnPrefix = "https://cdnjs.cloudflare.com/ajax/libs/";
    let query = React.findDOMNode(this.refs.search).value.trim();
    let results = React.findDOMNode(this.refs.results);
    let injected = React.findDOMNode(this.refs.injected);

    if (!query) {
      this.setState({ results: [] });
      return;
    }

    let URL = "http://api.cdnjs.com/libraries?search=" + query;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL);
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.responseText);
        response.results.map(function (item) {
          item.url = item.latest.replace(cdnPrefix, "");
        });
        response.results = response.results.reverse();
        _this.setState({ results: response.results });
      }
    });
    xhr.send();
  },
  setBadge(number) {
    let menuButton = app.props.sidebar.refs.libraries;
    menuButton.setState({ badge: number });
  }
});