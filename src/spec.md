# Specification

## Summary
**Goal:** Add password-protected edit and delete functionality for patient records in the history tab.

**Planned changes:**
- Add password authentication prompt (password: '020202') that appears when attempting to edit or delete patient records
- Add edit button to each patient record in history tab that opens a pre-populated form for modifying patient information
- Add delete button to each patient record in history tab with confirmation dialog after authentication
- Create backend function to update existing patient records by registration number
- Create backend function to delete patient records by registration number

**User-visible outcome:** Users can modify or delete patient records from the history tab after authenticating with the password '020202', with immediate reflection of changes in the patient list.
