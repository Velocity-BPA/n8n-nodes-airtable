# n8n-nodes-airtable-advanced

Advanced Airtable integration node for n8n with formula support.

## Features

- **Create Record**: Create new records in Airtable tables
- **Update Record**: Update existing records by ID
- **List Records**: Retrieve records with advanced filtering
- **Run Formula**: Execute Airtable formulas for complex queries

## Installation

To install this community node in n8n, follow these steps:

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-airtable-advanced`
4. Click **Install**

### Manual Installation

bash
npm install n8n-nodes-airtable-advanced


## Configuration

### Credentials Setup

1. Create a new credential of type "Airtable API"
2. Enter your Airtable API key
   - Get your API key from: https://airtable.com/api
   - Or create a personal access token: https://airtable.com/create/tokens

### Node Configuration

1. **Base ID**: Your Airtable base ID (starts with "app")
2. **Table Name**: The name of your table
3. **Operation**: Choose from Create, Update, List, or Formula
4. Configure operation-specific parameters

## Usage Examples

### Create Record

{
  "operation": "create",
  "baseId": "appXXXXXXXXXXXXXX",
  "tableName": "Tasks",
  "fields": [
    {
      "name": "Name",
      "value": "New Task"
    },
    {
      "name": "Status",
      "value": "In Progress"
    }
  ]
}


### List Records with Formula

{
  "operation": "list",
  "baseId": "appXXXXXXXXXXXXXX",
  "tableName": "Tasks",
  "formula": "AND({Status} = 'Active', {Priority} > 5)",
  "maxRecords": 50
}


### Update Record

{
  "operation": "update",
  "baseId": "appXXXXXXXXXXXXXX",
  "tableName": "Tasks",
  "recordId": "recXXXXXXXXXXXXXX",
  "fields": [
    {
      "name": "Status",
      "value": "Completed"
    }
  ]
}


## Formula Support

This node supports Airtable's powerful formula syntax:

- `{Field Name} = "Value"` - Exact match
- `AND({Field1} = "Value1", {Field2} > 10)` - Multiple conditions
- `OR({Status} = "Active", {Status} = "Pending")` - OR conditions
- `NOT({Status} = "Deleted")` - Negation
- `SEARCH("keyword", {Description})` - Text search
- `IS_AFTER({Created}, "2023-01-01")` - Date comparisons

## Troubleshooting

### Common Issues

1. **Invalid API Key**: Ensure your API key is correct and has proper permissions
2. **Base ID Format**: Base IDs start with "app" followed by 14 characters
3. **Table Name**: Use exact table name (case-sensitive)
4. **Formula Syntax**: Check Airtable's formula documentation for correct syntax

### Rate Limits

Airtable API has rate limits:
- 5 requests per second per base
- This node automatically handles basic rate limiting

## Support

For issues and feature requests, please visit our GitHub repository.

## License

This project is licensed under the Business Source License 1.1 (BSL 1.1).

### License Summary

- **Use**: You may use this software for any purpose except production use that competes with Airtable services
- **Modification**: You may modify this software
- **Distribution**: You may distribute this software
- **Commercial Use**: Permitted for Acme Corp under separate commercial license
- **Change Date**: 4 years from first publication
- **Change License**: Apache License 2.0

See the [LICENSE](LICENSE) file for full terms.

## Commercial License

Acme Corp has been granted a perpetual commercial license for this software. Contact us for commercial licensing options for your organization.