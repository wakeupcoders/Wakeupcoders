const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get('cert');

const certificate = "./certificates/"+paramValue + '.json';

function checkIfJsonFileExists(filePath) {
 const xhr = new XMLHttpRequest();
 xhr.open('HEAD', filePath, false);
 xhr.send();

 return xhr.status === 200;
}

if (checkIfJsonFileExists(certificate)) {
 fetch(certificate)
  .then(response => response.text())
  .then(data => {
   const jsonData = JSON.parse(data);
   const certContainer = document.querySelector('.cert-container');
   certContainer.style.display = 'block';
   document.getElementById('invalid').style.display = "none";
   document.getElementById('cert-id').innerHTML = `Certificate Id: <span>${jsonData.certification_id}</span>`;
   document.getElementById('host-server-id').innerHTML = `Hosting Server Id: <span>${jsonData.Server_id}</span>`;
   document.getElementById('lms-id').innerHTML = `Learning Management System Id: <span>${jsonData.lms_id}</span>`;
   document.getElementById('user-id-string').innerHTML = `User Id: <span>${jsonData.user_id}</span>`;
   document.querySelector('h2 span:first-child').innerHTML = jsonData['First Name'];
   document.querySelector('h2 span:last-child').innerHTML = jsonData['Last Name'];
   document.getElementById('course-id-string').innerHTML = `Course Id: <span>${jsonData.course_id}</span>`;
   document.querySelector('h1 span').innerHTML = jsonData['Course Title'];
   document.getElementById('certification_date').innerHTML = `<span>${jsonData.certification_date}</span>`;
   document.getElementById('verifyLink').innerHTML = `wakeupcoders.com/verify?cert=${paramValue}`;
  });




 console.log(`The JSON file ${certificate} exists.`);
} 

else {
 Swal.fire({
  title: "Oops!! No Certificate Found",
  text: "Please Contact Admin For Clarification.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Contact Admin"
 }).then((result) => {
  if (result.isConfirmed) {
   window.location.href = 'https://wakeupcoders.com/contact';
  }
 });
}




