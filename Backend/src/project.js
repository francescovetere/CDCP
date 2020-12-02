'use strict';

/**
 * Classe che modella un progetto
 */

class Project {
    constructor(id, title, inputType, records = []) {
        this._id = id;
        this._title = title;
        this._inputType = inputType;
        this._timeStamp = new Date();
        this._records = records;
    }
    
    // getters/setters
    get id() { return this._id; }

    get title() { return this._title; }
    set title(title) { this._title = title; }

    get inputType() { return this._inputType; }
    set inputType(inputType) { this._inputType = inputType; }

    get timeStamp() { return this._timeStamp; }

    get records() { return this._records; }
    set records(inputType) { this._records = records; }


    insertRecord(val, tags) {
        let record = 
        {
            "val": val,
            "tags": tags
        };

        this._records.push(record);
        return record;
    }


    deleteRecord(record) {
        let recordIndex = this._records.findIndex(r => r.id === record.id);
        if(recordIndex == -1) {
            return null;
        }

        let deleted = this._records.splice(recordIndex, 1)[0];
        return deleted;
    }


    updateRecord(record) {
        let recordIndex = this._records.findIndex(r => r.id === record.id);
        if(recordIndex == -1) {
            return null;
        }
        
        this._records[recordIndex].val = record.val;
        this._records[recordIndex].tags = record.tags;
        return this._records[recordIndex];
    }
    


    // Data Transfer Object: oggetto adatto ad essere spedito in rete
    toDTO() {
        return {
            id: this._id,
            title: this._title,
            inputType: this._inputType,
            timeStamp: this._timeStamp,
            records: this._records
        };
        
    }
}

module.exports = Project;




/****************************
 *********** TEST ***********
 ****************************/
// run test with:
//   > node project.js

// let p1 = new Project("id1", "title1", "image", 
//     [
//         {
//             "val": "img/dog.png",
//             "tags":
//                 [
//                     {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
//                     {"tagName": "colors", "tagValues": ["brown", "black"]}
//                 ]
//         },

//         {
//             "val": "img/zebra.png",
//             "tags":
//                 [
//                     {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
//                     {"tagName": "colors", "tagValues": ["white", "black"]}
//                 ]
//         }
//     ]
// );

// console.log("\nfromatted_p1:\n");
// console.log(p1.toDTO());

// // TODO: campo 'tags' stampato purtroppo solamente come [Array], e quindi non esplicitato
// // I dati comunque ci sono, vedi stampa sotto

// console.log("\nfromatted_p1 tagValues:\n");
// console.log(p1.toDTO().records[0].tags[0].tagValues);