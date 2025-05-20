function getLinksEsa(data){
    const origin = "My Location";
    let partNumber = 1;
    let allCoords = [];
    data.forEach(client => {
        allCoords.push(client.location);
    });
    for (let i = 0; i < allCoords.length; i += 10) {
        const slice = allCoords.slice(i, i + 11);
        const destination = slice[slice.length - 1];
        const waypoints = slice.slice(0, -1);
        const baseUrl = 'https://www.google.com/maps/dir/?api=1';
        const originParam = `origin=${encodeURIComponent(origin)}`;
        const destinationParam = `destination=${encodeURIComponent(destination)}`;
        const waypointsParam = waypoints.length
            ? `&waypoints=${encodeURIComponent(waypoints.join('|'))}`
            : '';
        const travelMode = 'travelmode=driving';
        const link = `${baseUrl}&${originParam}&${destinationParam}${waypointsParam}&${travelMode}`;
        $(".buttons").append(`<a href="${link}" target="_blank" class="myButton">Tour navigieren #${partNumber}</a>`);
        partNumber++;
    }
    
    $('.separate').css('display', 'none');
    $('.buttons').css('display', 'flex');
}
function getClientList(){
    fetch('coords_esa.txt')
            .then(response => response.text())
            .then(text => {
                const tours = JSON.parse(text);
                const selectedTour = tours[option];
                if (!selectedTour || selectedTour.length === 0) {
                    throw new Error("No clients found for the selected tour.");
                }
                const data = {
                    clients: selectedTour.map(client => ({
                        name: client.Name,
                        location: client.Loc
                    }))
                };
                if (data.length < 2) {
                    alert("At least two coordinates required.");
                }
                $('.clientList').empty();
                let clientNumber=0;
                dataa = data.clients;
                data.clients.forEach(client => {
                    $('.clientList').append(`<label><input type="checkbox" value="item${clientNumber}">${client.name}</label><br>`);
                    clientNumber++;
                });
                $('.form').toggle();
                $('.separate').css('display', 'flex');
            })
            .catch(error => {
                console.error('Error:', error);
            });
}
function getLinks(){
    fetch('coords.txt')
            .then(response => response.text())
            .then(text => {
                const desiredTourId = option; // Certifique-se de que `option` contém o ID da tour selecionada

                // Regex para encontrar o bloco da tour
                const regex = new RegExp(`${desiredTourId}\\s*\\[([\\s\\S]*?)\\];`, 'm');
                const match = text.match(regex);

                if (!match) {
                    throw new Error(`Tour ID ${desiredTourId} not found.`);
                }

                // Extrair e parsear o conteúdo do array
                const arrayContent = `[${match[1]}]`;
                const allCoords = JSON.parse(arrayContent).map(coord => coord.trim());

                if (allCoords.length < 2) {
                    alert("At least two coordinates required.");
                }

                const origin = "My Location";
                $(".form").toggle(); // Mostra o container onde os links serão inseridos
                $(".back_arrow").toggle();
                let partNumber = 1;

                for (let i = 0; i < allCoords.length; i += 9) {
                    let slice = allCoords.slice(i, i + 10);

                    if(i!=0){
                        slice=allCoords.slice(i+1, i + 10);
                    }

                    const destination = slice[slice.length - 1];
                    const waypoints = slice.slice(0, -1);

                    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
                    const originParam = `origin=${encodeURIComponent(origin)}`;
                    const destinationParam = `destination=${encodeURIComponent(destination)}`;
                    const waypointsParam = waypoints.length
                        ? `&waypoints=${encodeURIComponent(waypoints.join('|'))}`
                        : '';
                    const travelMode = 'travelmode=driving';

                    const link = `${baseUrl}&${originParam}&${destinationParam}${waypointsParam}&${travelMode}`;

                    $(".buttons").append(`<a href="${link}" target="_blank" class="myButton">Tour navigieren #${partNumber}</a>`);
                    partNumber++;
                }
            })
            .catch(error => {
                console.error('Erro ao carregar coordenadas:', error);
            });
    }