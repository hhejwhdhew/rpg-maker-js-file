

/* Description:
 * ============================================================================
 * This plugin displays the value of a specific variable (default: ID 1) on the
 * map screen in a simple window. By default, it is intended to show the "coins"
 * variable, allowing players to see their current coin count at a glance.
 *
 * ============================================================================
 * How It Works:
 * ============================================================================
 * - Adds a small window to the map screen that dynamically updates whenever the
 *   associated variable changes.
 * - The variable ID used to track the coins can be configured via Plugin Manager.
 * - The position and size of the window are customizable within the code.
 */


(function () {
  const parameters = PluginManager.parameters("CoinDisplayOnMap");
  const variableId = Number(parameters["variableId"] || 1);

  // Extend Scene_Map to create and add the coin display window
  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows.call(this);
    this.createCoinDisplayWindow();
  };

  Scene_Map.prototype.createCoinDisplayWindow = function () {
    console.log("Creating Coin Display Window"); // Debugging log
    this._coinWindow = new CoinDisplayWindow(10, 10, 250, 70);
    this.addWindow(this._coinWindow);
  };

  // Define the Coin Display Window
  function CoinDisplayWindow() {
    this.initialize.apply(this, arguments);
  }

  CoinDisplayWindow.prototype = Object.create(Window_Base.prototype);
  CoinDisplayWindow.prototype.constructor = CoinDisplayWindow;

  CoinDisplayWindow.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  CoinDisplayWindow.prototype.refresh = function () {
    this.contents.clear();
    const coins = $gameVariables.value(variableId) || 0; // Get variable value or default to 0
    const text = `Coins: ${coins}`;
    const textWidth = this.textWidth(text) + this.padding * 2; // Calculate required width
    this.width = textWidth > this.width ? textWidth : this.width; // Dynamically resize if needed
    this.createContents();
    this.drawText(text, 0, 0, this.contentsWidth(), "left");
  };

  CoinDisplayWindow.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.refresh();
  };
})();