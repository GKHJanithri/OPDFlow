// models/pharmacy/index.ts
// All pharmacy-flow models live in this folder so they cannot clash with the
// rest of the app. Every collection name contains "pharmacy".
export { default as PharmacyPrescription } from "./PharmacyPrescription";
export { default as PharmacyQueue } from "./PharmacyQueue";
export { default as PharmacyCounter } from "./PharmacyCounter";
export { default as PharmacyCollection } from "./PharmacyCollection";
