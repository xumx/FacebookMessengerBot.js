class Buttons {
  constructor(buttons) {
    this._buttons = [];

    if (buttons != null) {
      if (Array.isArray(buttons)) {
        buttons.forEach(button => this.add(button));
      } else {
        this.add(buttons);
      }
    }
  }

  add({
    text,
    data,
    url,
    phone,
    event,
    share,
    account_linking,
    webview_height_ratio,
    messenger_extensions,
    options
  }) {
    if (!data && !url && !event && !phone && !share) {
      throw Error(
        "Must provide a url or data i.e. {data: null} or {url: 'https://facebook.com'}"
      );
    }

    this._buttons.push({
      text: text || "Button",
      event,
      data,
      phone,
      share,
      url,
      account_linking,
      webview_height_ratio,
      options,
      messenger_extensions
    });
    return this;
  }

  toJSON() {
    const buttons = [];
    for (const button of this._buttons) {
      if (button.account_linking) {
        if (!button.account_linking.linking) {
          buttons.push({ type: "account_unlink" });
        } else if (button.url) {
          buttons.push({ type: "account_link", url: button.url });
        } else {
          throw Error("Missing url for account linking");
        }
      } else if (button.url) {
        buttons.push({
          type: "web_url",
          url: button.url,
          title: button.text,
          messenger_extensions: button.messenger_extensions,
          webview_height_ratio: button.webview_height_ratio || "full"
        });
      } else if (button.data != null) {
        const payload = JSON.stringify({
          data: button.data,
          event: button.event
        });
        buttons.push({
          type: "postback",
          payload,
          title: button.text,
          options: button.options
        });
      } else if (button.share) {
        buttons.push({ type: "element_share" });
      } else if (button.phone) {
        buttons.push({
          type: "phone_number",
          payload: button.phone,
          title: button.text
        });
      }
    }

    return buttons;
  }

  static from(array) {
    const buttons = new Buttons();
    array.forEach(arg => buttons.add(arg));
    return buttons;
  }

  get length() {
    return this._buttons.length;
  }
}

export default Buttons;
