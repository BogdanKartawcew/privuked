(function() {
    'use strict';

    const documentTemplateId = '161374001';
    const targetUrl = `https://my.e-consul.gov.ua/document-templates/${documentTemplateId}`;
    const numbersOfWeeksToAdd = 10;
    
    const originalMaxDateScript = `"maxDate":"(moment, value, step, document) => { 
        const numberWeeks = Number(document?.placeOfVisitInfo?.consularInstitution?.data?.numberWeeks); 
        return moment().add(numberWeeks, 'w')"
    }`;
    
    const updatedMaxDateScript = `"maxDate":"(moment, value, step, document) => { 
        const numberWeeks = Number(document?.placeOfVisitInfo?.consularInstitution?.data?.numberWeeks); 
        return moment().add(numberWeeks + ${numbersOfWeeksToAdd}, 'w')"
    }`;

    let original_fetch = unsafeWindow.fetch;
    
    unsafeWindow.fetch = async (url, init) => {
        let response = await original_fetch(url, init);
        
        if (url === targetUrl) {
            let clonedResponse = response.clone();
            let bodyText = await clonedResponse.text();
            let modifiedBody = bodyText.replace(originalMaxDateScript, updatedMaxDateScript);

            return new Response(modifiedBody, {
                status: clonedResponse.status,
                statusText: clonedResponse.statusText,
                headers: clonedResponse.headers
            });
        }

        return response;
    };
})();
