"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .sort('ordering') 
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    //DONE
    .post((req, res) => {
        console.log("POST /doctors");
        Doctor.create(req.body).save()
            .then(data => {
                res.status(201).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });
    
router.route("/doctors/:id")
    //DONE
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    //DONE
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findOneAndUpdate(
            { _id: req.params.id }, 
            req.body,
            { new: true })
        .then(data => {
            res.status(200).send(data);
        })            
        .catch(err => {
            res.status(404).send(err);
        });
    })
    //DONE
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({ _id: req.params.id })
            .then(data => {
                res.status(200).send(null);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    });
    
router.route("/doctors/:id/companions")
    //DONE
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        Companion.find({ doctors: req.params.id })
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    });
    

router.route("/doctors/:id/goodparent")
    //DONE
    .get(async (req, res) => {
        try {
            console.log(`GET /doctors/${req.params.id}/goodparent`);
            const numcomp = await Companion.find({ doctors: req.params.id }).count();
            const numcompalive = await Companion.find({ doctors: req.params.id , alive: true }).count();
            if (numcomp == numcompalive) 
                res.status(200).send(true);
            else
                res.status(200).send(false);
        }
        catch {
            res.status(404).send({message: req.params.id + "is not defined"});
        }
    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    //DONE
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .sort('ordering') 
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    //DONE
    .post((req, res) => {
        console.log("POST /companions");
        Companion.create(req.body).save()
            .then(data => {
                res.status(201).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

router.route("/companions/crossover")
    //DONE
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find( { "doctors.1": { "$exists": true }} )
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    //DONE
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    //DONE
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate(
            { _id: req.params.id }, 
            req.body,
            { new: true })
        .then(data => {
            res.status(200).send(data);
        })            
        .catch(err => {
            res.status(404).send(err);
        });
    })
    //DONE
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({ _id: req.params.id })
            .then(data => {
                res.status(200).send(null);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    });

router.route("/companions/:id/doctors")
    //DONE
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id)
            .then(data => {
                Doctor.find({ _id: {$in: data.doctors}})
                    .then(comp => {
                        res.status(200).send(comp);
                    })
            })
            .catch(err => {
                res.status(404).send(err);
            });
    });

router.route("/companions/:id/friends")
    //DONE
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id)
            .then(data => {
                Companion.find({ seasons: {$in: data.seasons}, _id: {$ne: req.params.id}})
                    .then(comp => {
                        res.status(200).send(comp);
                    })
            })
            .catch(err => {
                res.status(404).send(err);
            });
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;