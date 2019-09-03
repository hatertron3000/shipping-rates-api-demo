const config = {
    "modules": [
        {
            "name": "Store Information",
            "path": "/dashboard/store-information",
            "component": "StoreInformation",
            "version": "1.0"
        },
        {
            "name": "Carrier Settings",
            "path": "/dashboard/carrier-settings",
            "component": "CarrierSettings",
            "version": "0.1"
        }
    ],
    "lang": {
        "Dashboard": {
            "Navigation": {
                "brand": "Patrick's Carrier Service"
            },
            "StoreInformation": {
                "button": "Get Information",
                "cta": "Click the button to retrieve information about this store.",
                "error": "Error retrieving store information",
                "heading": "Get Store Information"
            },
            "CarrierSettings": {
                "configure_services": "Configure Services",
                "cta": "Configure shipping services below",
                "currency_symbol": "$",
                "heading": "Carrier Settings",
                "reset": "Reset",
                "save": "Save",
                "service_name": "Service Name",
                "service_price": "Service Price"
            }
        },
        "Install": {
            "error": "Error during installation.",
            "heading": "Amplify BigCommerce",
            "success": "Successfully installed. Please close and reopen the app to begin using it.",
            "tos_intro": "Check this box to agree to the terms of service. Consider adding a form here to gather additional information.",
            "view_tos": "Click here to view the terms of service"
        },
        "Load": {
            "error": "Error loading the app"
        }
    }
}

export default config