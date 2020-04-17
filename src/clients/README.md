Bare bones implementation of Heroic and Metadata clients to get up and running for UI development. 
This will likely change or be completely redone.

Implements rudimentary caching for all endpoints (though this will likely need to change).

The current datasource metadata client does not separate concerns between data transformation and UI transformation - which included AngularJS dependencies.

Clients should simply accept data and return - performating NO UI transformation (except for template variable replacement). That work will be passed to the metadata hooks that consume them - which will then be passed to the components that consume the data.

