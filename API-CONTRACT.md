Yes. You can make the **entire `API-CONTRACT.md` much simpler**. You don't need all those long explanations and repeated JSON examples.

Copy this **whole thing as one file**:

````markdown
# CampusRecover API Contract

## Base URL

http://localhost:3000

> Current backend is running locally using Node.js + Express.
> Authentication with Amazon Cognito and DynamoDB integration will be added later.

---

## 1. Health Check

### GET /

Checks whether the backend is running.

### Response

```json
{
  "success": true,
  "message": "CampusRecover Backend is running"
}
````

---

## 2. Report Lost Item

### POST /lost-items

Reports a lost item.

### Request Body

```json
{
  "itemName": "Blue Bottle",
  "category": "Bottle",
  "description": "Blue Milton bottle with black cap",
  "location": "Block A",
  "date": "2026-09-20",
  "time": "10:30"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Lost item reported successfully",
  "itemId": "generated-uuid",
  "item": {
    "itemId": "generated-uuid",
    "itemName": "Blue Bottle",
    "category": "Bottle",
    "description": "Blue Milton bottle with black cap",
    "location": "Block A",
    "date": "2026-09-20",
    "time": "10:30",
    "status": "LOST",
    "createdAt": "timestamp"
  }
}
```

### Error

```json
{
  "success": false,
  "message": "All fields are required"
}
```

---

## 3. Report Found Item

### POST /found-items

Reports a found item.

### Request Body

```json
{
  "itemName": "Black Wallet",
  "category": "Wallet",
  "description": "Black leather wallet",
  "location": "Library",
  "date": "2026-09-20",
  "time": "12:00"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Found item reported successfully",
  "itemId": "generated-uuid",
  "item": {
    "itemId": "generated-uuid",
    "itemName": "Black Wallet",
    "category": "Wallet",
    "description": "Black leather wallet",
    "location": "Library",
    "date": "2026-09-20",
    "time": "12:00",
    "status": "FOUND",
    "createdAt": "timestamp"
  }
}
```

---

## 4. Get All Items

### GET /items

Returns all lost and found items.

### Response

```json
{
  "success": true,
  "count": 2,
  "items": [
    {
      "itemId": "item-id",
      "itemName": "Blue Bottle",
      "category": "Bottle",
      "description": "Blue Milton bottle with black cap",
      "location": "Block A",
      "date": "2026-09-20",
      "time": "10:30",
      "status": "LOST",
      "createdAt": "timestamp"
    }
  ]
}
```

---

## 5. Get Item By ID

### GET /items/{id}

Returns one item using its item ID.

### Example

GET /items/item-id

### Response

```json
{
  "success": true,
  "item": {
    "itemId": "item-id",
    "itemName": "Blue Bottle",
    "category": "Bottle",
    "description": "Blue Milton bottle with black cap",
    "location": "Block A",
    "date": "2026-09-20",
    "time": "10:30",
    "status": "LOST",
    "createdAt": "timestamp"
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Item not found"
}
```

---

## 6. Get Lost Items

### GET /lost-items

Returns all lost items.

### Response

```json
{
  "success": true,
  "count": 1,
  "items": []
}
```

---

## 7. Get Found Items

### GET /found-items

Returns all found items.

### Response

```json
{
  "success": true,
  "count": 1,
  "items": []
}
```

---

## 8. Update Item Status

### PATCH /items/{id}

Updates the status of an item.

### Request Body

```json
{
  "status": "CLAIMED"
}
```

### Allowed Status

```text
LOST
FOUND
CLAIMED
RETURNED
```

### Response

```json
{
  "success": true,
  "message": "Item status updated successfully",
  "item": {}
}
```

---

## 9. Submit Claim

### POST /claims

Submits a claim for an item.

### Request Body

```json
{
  "itemId": "item-id",
  "reason": "This is my bottle. It has my name written on it."
}
```

### Response

```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "claimId": "generated-uuid",
  "claim": {
    "claimId": "generated-uuid",
    "itemId": "item-id",
    "reason": "This is my bottle. It has my name written on it.",
    "status": "PENDING",
    "createdAt": "timestamp"
  }
}
```

---

## 10. Get All Claims

### GET /claims

Returns all claims.

### Response

```json
{
  "success": true,
  "count": 1,
  "claims": []
}
```

---

## 11. Get Claim By ID

### GET /claims/{id}

Returns a specific claim.

### Response

```json
{
  "success": true,
  "claim": {
    "claimId": "claim-id",
    "itemId": "item-id",
    "reason": "This is my bottle.",
    "status": "PENDING",
    "createdAt": "timestamp"
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Claim not found"
}
```

---

## 12. Update Claim Status

### PATCH /claims/{id}

Updates the status of a claim.

### Request Body

```json
{
  "status": "APPROVED"
}
```

### Allowed Status

```text
APPROVED
REJECTED
```

### Response

```json
{
  "success": true,
  "message": "Claim status updated successfully",
  "claim": {}
}
```

---

## 13. Authentication

Authentication will be implemented using Amazon Cognito.

Currently, the local APIs do not require authentication.

After Cognito integration, protected APIs will use:

```text
Authorization: Bearer <access-token>
```

The Cognito user `sub` will be used to identify the authenticated user.

Admin operations will be restricted to authorized admin users.

---

## 14. Current Backend Status

* Backend: Node.js + Express
* Database: In-memory storage currently
* Authentication: Amazon Cognito - pending
* Database: DynamoDB - pending
* API Gateway: pending
* AWS Lambda: pending
* CloudWatch: pending

---

## 15. Important Notes

* `itemId` identifies an item.
* `claimId` identifies a claim.
* IDs are generated automatically by the backend.
* Current data is temporary and will be lost when the server restarts.
* DynamoDB will provide permanent storage after AWS integration.
* Cognito will provide authentication after AWS integration.
* The frontend team can use this document to connect to the backend APIs.

```

**This is the version I recommend you actually keep.** It's clean enough for your teammates and hackathon submission, without unnecessary documentation.
```
