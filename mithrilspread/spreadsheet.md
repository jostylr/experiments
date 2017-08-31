# Spreadsheet in Mithril

After attempting to follow along an older Mithril.js version of a spreadsheet,
I decided to start from scratch. 

The goal with this one is to have multiple spreadsheets, each with possible
multiple sheets inside to reference one another inside the sheets. This model
will generally be stored in a postgresql database. 

So we need to create:

* frontend with routes for the spreadsheets and a file overview. 
* backend using nodejs-hapi to handle the data coming in and out. 
* postgres db setup
* a setup of diff logs stored to replay creations

This should serve as a good model for future uses. 

The spreadsheet should have formulas that reference other cells/sheets,
draggable rows and columns that then update the relevant formulas. It should
be locally saved for dirty states and stored in a canonical version online. 

## Model

One global object that holds 



