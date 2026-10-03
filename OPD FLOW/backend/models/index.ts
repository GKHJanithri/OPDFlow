// models/index.ts
// Import this file once (import "./models") so every model is registered
// and Mongoose creates all opd_* collections and indexes on startup.
export { default as User } from "./User";
export { default as AuthToken } from "./AuthToken";
export { default as Hospital } from "./Hospital";
export { default as Patient } from "./Patient";
export { default as CaregiverLink } from "./CaregiverLink";
export { default as Doctor } from "./Doctor";
export { default as DoctorSchedule } from "./DoctorSchedule";
export { default as Appointment } from "./Appointment";
export { default as Queue } from "./Queue";
export { default as QueueEntry } from "./QueueEntry";
export { default as Notification } from "./Notification";
export { default as Announcement } from "./Announcement";
export { default as HospitalContact } from "./HospitalContact";
export { default as Conversation } from "./Conversation";
export { default as Message } from "./Message";
export { default as Rating } from "./Rating";
export { default as Counter } from "./Counter";
export { default as AuditLog } from "./AuditLog";
export * from "./PharmacyIndex";

