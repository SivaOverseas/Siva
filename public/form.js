document.getElementById('loanForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;

  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    loan_type: form.loan_type.value,
    loan_amount: parseInt(form.loan_amount.value)
  };

  try {
    const res = await fetch('/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const messageEl = document.getElementById('responseMessage');

    if (res.ok) {
      form.reset();
      messageEl.textContent = 'Application submitted successfully!';
      messageEl.classList.remove('hidden', 'text-red-600');
      messageEl.classList.add('text-green-600');
    } else {
      messageEl.textContent = 'Failed to submit application.';
      messageEl.classList.remove('hidden', 'text-green-600');
      messageEl.classList.add('text-red-600');
    }
  } catch (error) {
    console.error('Submission error:', error);
  }
});
