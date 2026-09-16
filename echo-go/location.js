(function () {
  "use strict";

  const stateNames = Object.keys(NG_LOCATIONS);

  function populateStates(selectEl) {
    stateNames.forEach(function (state) {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      selectEl.appendChild(opt);
    });
  }

  function wireStateToLga(stateSelectId, lgaSelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    const lgaSelect = document.getElementById(lgaSelectId);

    populateStates(stateSelect);

    stateSelect.addEventListener("change", function () {
      const lgas = NG_LOCATIONS[stateSelect.value] || [];

      lgaSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = lgas.length ? "Select LGA" : "Select state first";
      lgaSelect.appendChild(placeholder);

      lgas.forEach(function (lga) {
        const opt = document.createElement("option");
        opt.value = lga;
        opt.textContent = lga;
        lgaSelect.appendChild(opt);
      });

      lgaSelect.disabled = lgas.length === 0;
    });
  }

  wireStateToLga("pickupState", "pickupLga");
  wireStateToLga("dropoffState", "dropoffLga");

  // A friendly manifest number, purely cosmetic.
  const manifestNo = "DR-" + Math.floor(100000 + Math.random() * 900000);
  const manifestNoEl = document.getElementById("manifestNo");
  if (manifestNoEl) manifestNoEl.textContent = manifestNo;

  const form = document.getElementById("deliveryForm");
  const errorEl = document.getElementById("formError");
  const confirmation = document.getElementById("confirmation");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      errorEl.textContent = "Please fill in every required field before submitting.";
      return;
    }

    errorEl.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());

    // TODO: replace this block with your real API call, e.g.
    // fetch("/api/deliveries", { method: "POST", body: JSON.stringify(data) })
    showConfirmation(data, manifestNo);
  });

  function showConfirmation(data, refNo) {
    document.getElementById("confirmManifestNo").textContent = refNo;

    const grid = document.getElementById("confirmationGrid");
    grid.innerHTML = "";

    const rows = [
      ["Pickup", data.pickupAddress + ", " + data.pickupLga + ", " + data.pickupState],
      ["Drop-off", data.dropoffAddress + ", " + data.dropoffLga + ", " + data.dropoffState],
      ["Package", data.packageName + " (" + data.packageWeight + " kg)"],
      ["Receiver", data.receiverName + " — " + data.receiverPhone],
      ["Receiver address", data.receiverAddress]
    ];

    rows.forEach(function (pair) {
      const dt = document.createElement("dt");
      dt.textContent = pair[0];
      const dd = document.createElement("dd");
      dd.textContent = pair[1];
      grid.appendChild(dt);
      grid.appendChild(dd);
    });

    form.hidden = true;
    confirmation.hidden = false;
  }

  document.getElementById("newRequestBtn").addEventListener("click", function () {
    form.reset();
    // Reset dependent LGA selects since .reset() won't rebuild their options.
    ["pickupLga", "dropoffLga"].forEach(function (id) {
      const sel = document.getElementById(id);
      sel.innerHTML = '<option value="" disabled selected>Select state first</option>';
      sel.disabled = true;
    });
    confirmation.hidden = true;
    form.hidden = false;
  });
})();