# Security Specification

## 1. Data Invariants
1. Unauthenticated and non-admin visitors cannot read unapproved (`pending` or `rejected`) guestbook entries.
2. Unauthenticated visitors cannot alter existing guestbook entries, elevate statuses to `approved`, or delete entries.
3. Inquiries containing customer PII (email, phone, name, message) can only be read, listed, or managed by authorized administrators (`frichtle@gmail.com`, `walter.leppert@aol.com`, or records in `/admins/{adminId}`).
4. Visitors can submit inquiries with `status == 'new'` and valid string lengths, but cannot update or delete inquiries.
5. Visitors can read gallery items, but only administrators can add, modify, or delete gallery photos.
6. Admin role elevation cannot be self-assigned.

## 2. The Dirty Dozen Payloads
1. **Dirty 1 - Guestbook Auto-Approve Injection**: Unauthenticated visitor submits `GuestbookEntry` with `status: "approved"` directly. Must be REJECTED.
2. **Dirty 2 - Guestbook Field Explosion Attack**: Visitor injects arbitrary payload with `isVerified: true`, `role: "admin"`. Must be REJECTED.
3. **Dirty 3 - Guestbook Massive Text Denial-of-Wallet**: Review `text` exceeding 2000 characters. Must be REJECTED.
4. **Dirty 4 - Guestbook Malicious Rating**: Rating set to 999 or -5 instead of 1 to 5. Must be REJECTED.
5. **Dirty 5 - Guestbook Unauthorized Mutation**: Anonymous user tries to update text or rating of an existing guestbook entry. Must be REJECTED.
6. **Dirty 6 - Inquiry PII Exfiltration**: Public visitor attempts `list` or `get` on `/inquiries`. Must be REJECTED.
7. **Dirty 7 - Inquiry Status Escalation**: Public user creates inquiry with `status: "completed"`. Must be REJECTED.
8. **Dirty 8 - Inquiry Delete Tampering**: Visitor attempts to delete an inquiry document. Must be REJECTED.
9. **Dirty 9 - Gallery Unauthorized Write**: Non-admin attempts to create a `GalleryItem`. Must be REJECTED.
10. **Dirty 10 - Gallery Delete Attempt**: Non-admin attempts to delete a `GalleryItem`. Must be REJECTED.
11. **Dirty 11 - Admin Self-Privilege Creation**: User creates `/admins/{theirUid}` with `role: "admin"`. Must be REJECTED.
12. **Dirty 12 - Document ID Traversal/Poisoning**: Attacker passes oversized or special character document ID like `../../root`. Must be REJECTED.
