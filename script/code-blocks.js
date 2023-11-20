//Button Section




const btnLabels = ["Save Draft","Add Personnel", "Back"];
const btnIds2 = ["btn-add-contractor-draft","btn-add-contract-person","btn-back-dashboard"];


	for(w=0;w<btnLabels.length;w++){

		const button = document.createElement("button");
		button.setAttribute("class","btn-std");
		button.innerText=btnLabels[w];
		button.setAttribute("id",btnIds2[w]);

		bottomContainer.appendChild(button);

		button.addEventListener('click',(e)=>{

			const idName = e.target.id;

			if(idName=="btn-back-dashboard"){
				displayDashboard();
			}else{
				main(idName.slice(4));
			}

		})
	}




	        const changeEvent = new Event("change");
         document.getElementById("input-vi-nationality").dispatchEvent(changeEvent);