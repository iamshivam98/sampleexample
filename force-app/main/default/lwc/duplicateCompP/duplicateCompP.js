import { LightningElement, api, wire, track } from 'lwc'; 
import searchPotentialDuplicates from '@salesforce/apex/PotentialDuplicateComponentController.searchPotentialDuplicates'; 
import updateMasterRecord from '@salesforce/apex/PotentialDuplicateComponentController.updateMasterRecord'; 
import sobjectfields from '@salesforce/apex/PotentialDuplicateComponentController.getSObjectFields'; 
import { getObjectInfo } from '@salesforce/apex'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 



const columnss = [ 

{ label: 'API Name', fieldName: 'fieldName' } 

]; 

export default class PotentialDuplicates extends LightningElement { 

@api recordId; 

@api objectApiName; 

@track potentialDuplicates; 

@track count; 

@track isModalOpen = false; 

@track isSecondModalOpen=false; 

@track selectedRowIds = []; 

@track heading; 

@track sobjectName; 

@track DuplicateRecordCountWrapper; 

@track fieldNames = []; 

@track duplicateFieldsnames; 

@track record; 

@track fieldss = []; 

@track fieldInfo = []; 

@track columnss; 

@track dattaa = []; 

@track dataValue = []; 

@track abc = []; 

@track listofrecords = []; 

@track selectedRowIdss; 

@api listOfRecords; 

selectedField = ''; 

@track masterRecordId; 

@track selectedmaster; 

@track listofrecords = []; 

@track selectedvalues= []; 

@track selectedmaster; 

@track myObjs= []; 

@track isThirdModel = false; 

@track getMapdata =[]; 



@wire(searchPotentialDuplicates, { objectApiName: '$objectApiName', recordId: '$recordId' }) 

wiredResult({ error, data }) { 
    if (data) { 

        console.log('datat' + data); 

        this.DuplicateRecordCountWrapper = data; 

        console.log('lkjh' + this.DuplicateRecordCountWrapper.duplicateRecords); 

        console.log({ data }); 



        this.potentialDuplicates = this.DuplicateRecordCountWrapper.duplicateRecords; 



        this.duplicateFieldsnames = this.DuplicateRecordCountWrapper.fieldsNames; 



        this.count = this.potentialDuplicates.length - 1; 

        this.error = undefined; 

        // set selected row as default 

        const currentRecord = this.potentialDuplicates.find(record => record.Id === this.recordId); 

        if (currentRecord) { 

            this.selectedRowIds = [currentRecord.Id]; 

            

        } 

    } else if (error) { 

        this.error = error; 

        this.potentialDuplicates = undefined; 



    } 

} 



get columns() { 



    if (this.potentialDuplicates && this.potentialDuplicates.length > 0) { 



        const fieldNames = Object.keys(this.potentialDuplicates[0]) 

            .filter(fieldName => fieldName != 'Id' && this.duplicateFieldsnames.includes(fieldName)); 

        console.log('FIELDS' + fieldNames); 



        return [ 

            ...fieldNames.map(fieldName => { 

                return { 

                    // if(duplicateFieldsnames.includes(fieldName)){ 

                    label: fieldName, 

                    fieldName: fieldName 

                    //} 

                }; 

            }) 

        ]; 

    } 

    return []; 

} 



openModal() { 

    this.isModalOpen = true; 

    console.log('ffff' + this.potentialDuplicates); 

    console.log('fhjkl' + columns); 



} 



closeModal() { 

    this.isModalOpen = false; 

} 

closeSecModal() { 

    this.isSecondModalOpen = false; 

    this.isThirdModel = false; 

} 


@track isNotSelectedRow = true;
handleRowSelection(event) {  

    const selectedRows = event.detail.selectedRows; 

    

    this.selectedRowIds = selectedRows.map(row => row.Id); 

    console.log('67'+this.selectedRowIds); 

    const recordIds = selectedRows.map(row => row.Id); 

    this.selectedRowIdss= recordIds; 

    if(this.selectedRowIdss.length != 1 || this.selectedRowIdss.length != 0){
        this.isNotSelectedRow = false;
    }
    else{
        this.isNotSelectedRow = true;

    }

    console.log('68'+this.selectedRowIdss); 

    console.log("Selected Record Ids: ", recordIds); 

} 




handleNext() { 

    this.selectedDuplicates = this.potentialDuplicates.filter(record => this.selectedRowIds.includes(record.Id)); 

    console.log('106 ' + this.selectedRowIds); 

    console.log('107 ' + this.selectedDuplicates); 

    this.isModalOpen = false; // hide the first modal 

    this.isSecondModalOpen = true; // show the second modal 

    console.log(this.objectApiName + '  ==  This  --  ' + this.recordId); 

    this.displayData(); 

    this.selectedRowIdss = this.selectedRowIds; 

    console.log('isSecondModalOpen' +this.isSecondModalOpen); 

    console.log('  isModalOpen' + this.isModalOpen); 

} 

handlePrevious() { 

    this.isSecondModalOpen = false; 

    this.isModalOpen = true; 

    this.listofrecords=[]; 

} 

connectedCallback() { 

    this.sobjectName = this.objectApiName.charAt(0).toUpperCase() + this.objectApiName.slice(1); 

    this.heading = `Potential Duplicate ${this.sobjectName} Records`; 

} 



@wire(sobjectfields, { objectApiName: '$objectApiName' }) 

wiredFields({ error, data }) { 

    if (data) { 

        this.fieldss = data; 

        console.log('Fields:', data); 

        console.log('this.fieldss' +JSON.stringify(this.fieldss)); 

    } else if (error) { 

        console.error(error); 



    } 

} 



displayData() { 

        

    var keyItem = this.fieldss; 



    // for (let fieldName in this.selectedDuplicates[1]) { 

    //     keyItem.push(fieldName); 

    //     console.log('keyItem' +keyItem); 

    //     console.log('this.selectedDuplicates[0]' +JSON.stringify(this.selectedDuplicates[1])); 

    // } 



        

    for(var item in keyItem){ 

        var fieldvalues = []; 

        var value = keyItem[item]; 

        console.log('value' +value); 

        



        for(var entry in this.selectedDuplicates){ 

            console.log('entry' +entry); 

            

                

            var fieldvalue1 = this.selectedDuplicates[entry][value]; 

            if(!fieldvalue1){ 

                fieldvalue1 = 'NA'; 

            } 

            fieldvalues.push(fieldvalue1); 

// When fields value and name are null or empty string then the code is failing so we are checking null and empty and assigning value it to NA               

        } 

        console.log('fieldvalues' +fieldvalues); 

        this.listofrecords.push({value, fieldvalues}); 

    } 

console.log('selectedDuplicates' +this.selectedDuplicates); 

    console.log('listofcount' + this.listofrecords.count); 

    console.log('listofrecords' + this.listofrecords); 

    console.log('listofrecords' + JSON.stringify(this.listofrecords)); 

    //this.isSecondModalOpen = true; 

    

} 





masterrecId(event) { 

this.selectedmaster = event.target.value; 

this.masterRecordId = this.selectedmaster; 

console.log('selectedmaster: ' + this.selectedmaster); 

console.log('selected master: ' + JSON.stringify(this.masterrecord)); 

console.log('selectedMasterRecord: ' + JSON.stringify(this.selectedMasterRecord));  

} 



@track selectedvalues; 

@track sfield=[]; 

@track svalue=[]; 

handleRadioChange(event){ 

console.log('this is values' ); 

this.selectedvalues = event.target.value;  

console.log('fieldff' +event.target.name); 

console.log('this.selectedvalues' +event.target.value); 



this.sfield.push(event.target.name ); 

this.svalue.push(event.target.value); 





var myObj = { 

fieldName : event.target.name, 

fieldValue : event.target.value 

    

}; 



console.log('uij '+this.ss); 

console.log('myobj' +myObj.fieldName + myObj.fieldValue); 

this.myObjs.push(myObj); 

//this.getMapdata.push(event.target.name,event.target.value); 



console.log('myobjvalues' +JSON.stringify(this.myObjs)); 





} 



handlenaxt1(){ 

console.log('myobjvalue' +JSON.stringify(this.myObjs)); 

console.log('ioio '+JSON.stringify(this.myObjs).fieldName); 

this.isThirdModel = true; 

this.isSecondModalOpen = false; 

this.getMapdata.push(this.selectedmaster); 

console.log('73hyfo '+ JSON.stringify(this.getMapdata)); 

console.log('yyy '+ this.objectApiName); 

//this.ss.push(myObjs.fieldName, myObjs.fieldValue); 

console.log('ioia '+this.ss); 

} 




handlemerge() {   

console.log('merge is called '); 

updateMasterRecord({masterrecId :this.selectedmaster, fiel:this.sfield,valu:this.svalue,recordId:this.selectedRowIds}) 

.then(result => { 

    console.log(result); 

    const evt = new ShowToastEvent({ title:"Success", message: "Successful", variant: 'success' }); this.dispatchEvent(evt); 

    // Handle success 
    this.isThirdModel = false;

}) 

.catch(error => { 

    console.log(error); 

    const evt = new ShowToastEvent({ title: "Error", message: error, variant: 'error'}); this.dispatchEvent(evt); 

    // Handle error 

}); 

} 

} 

