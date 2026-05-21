import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

export class OncCustomSubmitButtonControlV2 extends LitElement {
  static properties = {
    buttonLabel: { type: String },
    ruleTriggeredButtonClass: { type: String },
    submitButtonClass: { type: String },
    submitFlag: { type: Boolean },
    cssClass: { type: String },
    currentPageMode: { type: String },
  };

  static getMetaConfig() {
    return {
      controlName: "Custom Submit Button V2",
      groupName: "ONC Custom",
      description: "Custom Submit button that will be triggered after ruletrigger button click",
      iconUrl: "button",
      search: ["custombutton", "submit", "customsubmit"],
      version: "2.0",
      pluginAuthor: "Preetha Ponnusamy",
      standardProperties: {
        description: true,
        visibility: true,
        tooltip: true,
      },
      properties: {
        buttonLabel: {
          type: "string",
          title: "Button Label",
          description: "Provide label to display on the button",
        },
        tooltip: {},
        ruleTriggeredButtonClass: {
          type: "string",
          title: "Rule Trigger Button Class",
          description: "Provide a classname used to locate the RuleTriggered button",
          required: true,
        },
        submitButtonClass: {
          type: "string",
          title: "Submit Button Class",
          description:
            "Provide a classname used to locate the Submit button. If the Submit button is from the Action Panel, you can leave this blank.",
        },
        submitFlag: {
          type: "boolean",
          title: "Submit Flag",
          description: "Update this field once rules are executed",
        },
        cssClass: {
          type: "string",
          title: "CSS Class",
          description: "Provide a classname used in styles",
        },
      },
    };
  }

  static styles = css`
    .button-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      height: 100%;
    }
    .submit-button {
      background-color: var(--ntx-form-theme-color-primary-button-background);
      color: var(--ntx-form-theme-color-primary-button-font);
      border-color: var(--ntx-form-theme-color-primary-button-background);
      font-family: var(--ntx-form-theme-font-family);
      font-size: var(--ntx-form-theme-text-label-size);
      border-radius: var(--ntx-form-theme-border-radius);
      min-width: 100px;
      width: auto;
      max-width: 100%;
      min-height: 33px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-width: 1px;
    }

    .submit-button:hover {
      background-color: var(var(--ntx-form-theme-color-primary-button-hover));
      color: var(--ntx-form-theme-color-primary-button-font);
    }
  `;

  constructor() {
    super();
    this.buttonLabel = "Submit";
    this.ruleTriggeredButtonClass = "";
    this.submitButtonClass = "";
    this.submitFlag = false;
    this.tooltip = "";
    this._userClickedSubmit = false;
  }

  render() {
    var currentPageModeIndex = this.queryParam("mode");
    this.currentPageMode = (currentPageModeIndex == 0 ? "New" : (currentPageModeIndex == 1 ? "Edit" : "Display"))
    if (this.currentPageMode == "Display" && !document.querySelector('a[data-e2e="runtime-menu-edit"]'))
    this.currentPageMode = "Edit";
    return html`${this.currentPageMode !== "Display" ? html`
      <div class="button-group" part="${this.cssClass ? this.cssClass+"_container" : "custom_submit_button_container"}">
        <button
          type="button"          
          class="submit-button"
          part="${this.cssClass ? this.cssClass : "custom_submit_button_group"}"
          @click=${this._triggerRuleButtonClick}
          title=${this.tooltip || ''}
        >
          ${this.buttonLabel}
        </button>
      </div>
    `: html`<div></div>`}
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('submitFlag')) {
      if (this.submitFlag == true && this._userClickedSubmit) {
        this._userClickedSubmit = false;
        this.submitFlag = false;
        this._triggerFormSubmission();
      }
    }
  }

  firstUpdated(){
    this.removeAttribute("title");
  }

  _triggerFormSubmission() {
    const formElement = document.querySelector("form");
    const submitButton = formElement.querySelector('button[type="submit"]');
    if (formElement) {
      if (this.submitButtonClass.length) {
        const button = formElement.querySelector(
          `.${this.submitButtonClass} button.submit-button`
        );
        button.click();
      }
      else if (submitButton) {
        submitButton.click();
      }
      else {
        console.error("Submit button not found!");
        alert("Submit button not found. Please check the configuration");
      }
    } else {
      console.error("Form not found!");
    }
  };

  _triggerRuleButtonClick() {
    if (!this.ruleTriggeredButtonClass) {
      console.warn("No actionButtonClass provided.");
      return;
    }
    const button = document.querySelector(
      `.${this.ruleTriggeredButtonClass} button.ruletriggered-button`
    );
    if (button) {
      this._userClickedSubmit = true;
      button.click();
    } else {
      console.warn(
        `RuleTriggered button not found for class: ${this.ruleTriggeredButtonClass}`
      );
      alert("RuleTriggered button not found. Please check the configuration");
    }
  }
  queryParam(param) {
    const urlParams = new URLSearchParams(decodeURIComponent(window.location.search.replaceAll("amp;", "")));
    return urlParams.get(param);
  }
}

customElements.define("onc-customsubmit-button-control-v2", OncCustomSubmitButtonControlV2);