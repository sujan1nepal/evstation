// Show Full Menu
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('showMenuBtn').onclick = function() {
        document.getElementById('fullMenu').style.display = 'block';
        this.style.display = 'none';
    };

    // Helper for AJAX form submission
    function submitForm(formId, apiEndpoint, msgId, dataBuilder) {
        document.getElementById(formId).onsubmit = async function(e) {
            e.preventDefault();
            const form = this;
            const msgDiv = document.getElementById(msgId);
            msgDiv.textContent = "Submitting...";

            let data;
            try {
                data = dataBuilder(form);
            } catch (err) {
                msgDiv.textContent = "Error: Invalid form data.";
                return;
            }

            try {
                const res = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                if (!res.ok) {
                    msgDiv.textContent = "Submission failed. Please try again.";
                } else {
                    const result = await res.json();
                    msgDiv.textContent = result.message || "Submitted successfully!";
                    form.reset();
                }
            } catch (error) {
                msgDiv.textContent = "Network error. Please try again.";
            }
        };
    }

    // Reservation form
    submitForm(
        'reservationForm',
        '/api/reservation',
        'reservationMsg',
        (form) => ({
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            date: form.date.value,
            time: form.time.value,
            guests: form.guests.value
        })
    );

    // Food order form
    submitForm(
        'orderForm',
        '/api/order',
        'orderMsg',
        (form) => ({
            name: form.order_name.value,
            phone: form.order_phone.value,
            items: Array.from(form.items.selectedOptions).map(opt => opt.value),
            notes: form.notes.value
        })
    );

    // Charging booking form
    submitForm(
        'chargingForm',
        '/api/charging',
        'chargingMsg',
        (form) => ({
            name: form.charge_name.value,
            phone: form.charge_phone.value,
            vehicle: form.vehicle.value,
            charging_type: form.charging_type.value,
            date: form.charge_date.value,
            time: form.charge_time.value
        })
    );
});