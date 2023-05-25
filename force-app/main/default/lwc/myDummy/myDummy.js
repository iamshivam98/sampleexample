import { LightningElement, wire, track, api } from 'lwc';
import getRecordsMethod from '@salesforce/apex/AccountController.getRecordsMethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import deleteRecord from '@salesforce/apex/AccountController.deleteRecord';
// import {deleteRecord} from 'lightning/uiRecordApi';
import MyModal from "c/myModal";
import MyMod from "c/myMod";
import Md from 'c/md';
import { updateRecord } from 'lightning/uiRecordApi';


export default class myDummy extends LightningElement {
    @track data = [];
    @track error;
    @track searchString;
    @track initialRecords = [];
    @track ara;
    @track d;
    @track recId;
    @track recordId;
    @track dataa = [];
    @track conformdelete = false;
    @track needconform = false;
    @track idss;


    // @api recordId=this.recId;

    @api objectApiName;


//////////////////////used connected callback fro getting the record of recordtype as TEMPLATE and for refreshApex////////////////////////////////

    connectedCallback() {
        this.displayData();
    }
    displayData() {
        getRecordsMethod()
            .then(result => {
                console.log(JSON.stringify(result) + 'ffffffffffff');
                this.data = result;
                console.log(JSON.stringify(this.data) + 'datata');
                this.initialRecords = this.data;
                console.log(JSON.stringify(this.initialRecords) + 'datatinitialRecordsa');
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });
        for (let saa of this.initialRecords) {
            let No = 1;
            this.ara = this.initialRecords[No];
            No += 1;
        }
        this.initialRecords.forEach((a) => { a.No = 1 });
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async handleAlertClick() {
    await LightningAlert.open({
        message: 'this is the alert message',
        theme: 'error', // a red theme intended for error states
        label: 'Error!', // this is the header text
    });
    //Alert has been closed
}

    // @wire(getRecordsMethod)
    // wiredAccount({ error, data }) {
    // if (data) {
    // console.log(data);
    // this.data = data;
    // this.initialRecords = data;
    // this.error = undefined;
    // } else if (error) {
    // this.error = error;
    // this.data = undefined;
    // }
    // }

/////////////////////////////////////////////for search bar////////////////////////////////////////////////////////////
    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        let searchRecords = [];
        if (this.dataa.length == 0) {
            this.dataa = this.initialRecords;
        }
        this.data = this.initialRecords;
        console.log(searchKey);
        if (!searchKey) {
            this.initialRecords = this.dataa;
        }
        if (searchKey) {
            this.data = this.initialRecords;

            if (this.data) {


                for (let record of this.data) {
                    let valuesArray = Object.values(record);

                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        if (val.toLowerCase().includes(searchKey)) {
                            searchRecords.push(record);
                            break;
                        }
                        // let strVal = String(val);

                        // if (strVal) {

                        //     if (val.toLowerCase().includes(searchKey)) {
                        //         searchRecords.push(record);
                        //        break;
                        //     }
                        // }
                    }
                }

                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));

                this.initialRecords = searchRecords;


                //searchRecords.length=0;
            }
        } else {
            this.initialRecords = this.dataa;
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////for Creating Accoiunt with recordtype as Train calling this method from Apex class///////////////////////////////
    async handleClick(event) {
        this.recId = event.target.value;

        // console.log('RecordId'  +event.target.value);
        // const selectedRecordId = event.target.dataset.id;

        console.log(this.recId + 'recordId');
        // console.log(this.nameField+ ' nameField');
        // console.log(this.currentPageReference.state.recId);
        const result = await MyMod.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: this.recId,

        });



        console.log(result);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

@track reccId;

//////////////////////////For updating and for toast message and taken initialrecord property to Md(md) to match the record/////////////////////////////////////
    async handleClicks(event) {
        if(event.target.value !=null){
            this.recId = event.target.value;
            this.reccId =event.target.value;
        }else{
            this.recId= this.reccId;
        }
       
        console.log(this.recId + ' recordId');
        var recordFlag = 0;
        // console.log(this.nameField+ ' nameField');
        // console.log(this.currentPageReference.state.recId);

        const result = await Md.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: this.recId,
            initialData: this.initialRecords
            //  content2: this.recordId,
        });
        console.log(result);
        //checking existing record name
        if (result != 'Cancel') {


            for (let i = 0; i < this.initialRecords.length; i++) {

                if (this.recId === this.initialRecords[i]) {
                    recordFlag = 1;
                }
            }

            const errortoastEvent = new ShowToastEvent({
                title: 'Record not updated',
                message: 'Duplicate record found',
                variant: 'error',
            })

            const toastEvent = new ShowToastEvent({
                title: 'Record Updated',
                message: 'Record updated successfully',
                variant: 'success',
            })

            //showing toast based on record existence
            if (result != 'Success') {

                this.dispatchEvent(errortoastEvent);
            }
            else {

                this.dispatchEvent(toastEvent);
            }

            this.displayData();
            console.log(result);
        }
        console.log('This at lasttttt  ==>  '+result);
        if(result == 'Failed'){
            this.handleClicks(event);
        }
    }
    updateRecord() {
        setTimeout(() => {
            eval("$A.get('e.force:refreshView').fire();");
        }, 2000);

    }
    conformdel(event) {
        this.needconform = true;
        this.idss = event.target.value;
        // this.needconform = false;
        // this.handledelete(event.target.value);

    }
    conformdela(event) {
        this.needconform = false;
        this.handledelete(this.idss);

    }
    hideModalBox(event) {
        this.needconform = false;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////c/md



/////////////////////////////////////////////////////////////////For Delete/////////////////////////////////////
    handledelete(event) {

        this.recordId = this.idss;
        console.log('5555555555555' + this.recordId)

        deleteRecord({ recordId: this.recordId })
            .then((result) => {
                this.displayData();
                this.initialRecords = result;
                const toastEvent = new ShowToastEvent({

                    title: 'Record Deleted',
                    message: 'Record deleted successfully',
                    variant: 'success',
                })

                this.dispatchEvent(toastEvent);
                return refreshApex(this.initialRecords);

            })
            .catch(error => {
                console.error(error);
            });
        // eval("$A.get('e.force:refreshView').fire();");

    }
    updateRecord() {
        setTimeout(() => {
            eval("$A.get('e.force:refreshView').fire();");
        }, 1000);

    }
      
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////