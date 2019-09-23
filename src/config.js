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
                "cancel": "Cancel",
                "configure_services": "Configure Services",
                "create": "Create new service",
                "cta": "Configure shipping services below",
                "currency_symbol": "$",
                "demo_disclaimer": "This carrier service is for demonstration purposes. As such, it only supports \"Flat Rate\" shipping methods, and the ability to identify a method as expedited. A production-ready shipping rates provider should handle additional logic like package size, carrier integrations, etc.",
                "edit": "Edit",
                "error_initialization": "Error retrieving services",
                "error_name": "Shipping service names must be 1-100 characters in length",
                "error_price": "The price is invalid",
                "heading": "Carrier Settings",
                "no_services": "No services to display",
                "reset": "Reset",
                "save": "Save",
                "service_name": "Service Name",
                "service_price": "Service Price",
                "update_services_error": "Error updating services",
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