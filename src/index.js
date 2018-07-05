/*global chrome*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if(!chrome.storage) {
    var items = {};
    items['collected'] = {
        "availability":{
            "archived_snapshots":{
                "closest":{
                    "available":true,
                    "status":"200",
                    "timestamp":"20180624052629",
                    "url":"http://web.archive.org/web/20180624052629/https://brainly.com/"
                }
            },
            "url":"https://brainly.com"
        },"brainly_data":{
            "all_answers":[
                {
                    "num_thanks":1,
                    "num_upvotes":1,
                    "question":"The science of naming organisms and assigning them to groups is called _______.\nA. classification\nB. phylogeny\nC. taxonomy\nD. genetics",
                    "rating":5,
                    "reputation":"Ambitious",
                    "subject":"Biology",
                    "text":"\nC. Taxonomy\n\nTaxonomy is the science of naming and classifying organisms into certain groups\n\nThe complete and correct hierarchy of taxonomic groups from largest to smallest are:\n1) Domain\n     1.1) Archaea  1.2) Bactera  1.3) Eukarya\n2) Kingdom\n     2.1) Animalia  2.2) Plantae  2.3) Fungi  2.4) Protista  2.5) Archaea  2.6) Bacteria\n3) Phylum - has 35 phyla\n4) Class \n5) Order\n6) Family\n7) Genus\n8) Species\n",
                    "user":"taskmasters"
                },
                {
                    "num_thanks":1,
                    "num_upvotes":2,
                    "question":"The science of naming organisms and assigning them to groups is called _______.\nA. classification\nB. phylogeny\nC. taxonomy\nD. genetics",
                    "rating":5,
                    "reputation":"Beginner",
                    "subject":"Biology",
                    "text":"\nTaxonomy because classifying organisms and assigning them universally ",
                    "user":"tiffanypowell"
                }
            ],
            "date":"1455865001",
            "question":"The science of naming organisms and assigning them to groups is called _______.\nA. classification\nB. phylogeny\nC. taxonomy\nD. genetics",
            "subject":
            "Biology",
            "top_answer":{
                "num_thanks":1,
                "num_upvotes":1,
                "question":"The science of naming organisms and assigning them to groups is called _______.\nA. classification\nB. phylogeny\nC. taxonomy\nD. genetics",
                "rating":5,
                "reputation":"Ambitious",
                "subject":"Biology",
                "text":"\nC. Taxonomy\n\nTaxonomy is the science of naming and classifying organisms into certain groups\n\nThe complete and correct hierarchy of taxonomic groups from largest to smallest are:\n1) Domain\n     1.1) Archaea  1.2) Bactera  1.3) Eukarya\n2) Kingdom\n     2.1) Animalia  2.2) Plantae  2.3) Fungi  2.4) Protista  2.5) Archaea  2.6) Bacteria\n3) Phylum - has 35 phyla\n4) Class \n5) Order\n6) Family\n7) Genus\n8) Species\n",
                "user":"taskmasters"
            }
        },
        "domain":"brainly.com",
        "href":"https://brainly.com/question/998069",
        "source":"com",
        "time":1530722098176
    }

    items['response'] = {
        "all_answers":[
            {
                "inference":{
                    "clearness":9,
                    "completeness":11,
                    "correctness":52,
                    "credibility":88
                },
                "num_thanks":1,
                "num_upvotes":1,
                "question":"The science of naming organisms and assigning them to groups is called _______.\nA. classification\nB. phylogeny\nC. taxonomy\nD. genetics",
                "rating":5,
                "reputation":"Ambitious",
                "subject":"Biology",
                "text":"\nC. Taxonomy\n\nTaxonomy is the science of naming and classifying organisms into certain groups\n\nThe complete and correct hierarchy of taxonomic groups from largest to smallest are:\n1) Domain\n     1.1) Archaea  1.2) Bactera  1.3) Eukarya\n2) Kingdom\n     2.1) Animalia  2.2) Plantae  2.3) Fungi  2.4) Protista  2.5) Archaea  2.6) Bacteria\n3) Phylum - has 35 phyla\n4) Class \n5) Order\n6) Family\n7) Genus\n8) Species\n",
                "user":"taskmasters"
            },
            {
                "inference":{
                    "clearness":3,
                    "completeness":30,
                    "correctness":63,
                    "credibility":76
                },
                "num_thanks":1,
                "num_upvotes":2,
                "question":"The science of naming organisms and assigning them to groups is called _______.\nA. classification\nB. phylogeny\nC. taxonomy\nD. genetics",
                "rating":5,
                "reputation":"Beginner",
                "subject":"Biology",
                "text":"\nTaxonomy because classifying organisms and assigning them universally ",
                "user":"tiffanypowell"
            }
        ]
    }

    ReactDOM.render(<App collected={items['collected']} 
        response={items['response']}/>, 
        document.getElementById('root'));
    registerServiceWorker();
} else {
    chrome.storage.sync.get(['collected', 'response'], function(items) {
        console.log(items)
        ReactDOM.render(<App collected={items['collected']} 
            response={items['response']}/>, 
            document.getElementById('root'));
        registerServiceWorker();
    });
}
