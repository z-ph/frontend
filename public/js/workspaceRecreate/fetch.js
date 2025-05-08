async function updateData() {
  const localData = JSON.parse(localStorage.getItem('templateList')) || [];
  const respone = await fetch('http://localhost:3000/update-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userName: JSON.parse(localStorage.getItem('userName')),
      data: localData
    })
  });
  const data = await respone.json();
  if (data) {
    console.log(data);
  }
}