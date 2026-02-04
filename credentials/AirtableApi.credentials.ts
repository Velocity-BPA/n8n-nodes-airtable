/*
 * Business Source License 1.1 (BSL 1.1)
 * Copyright (c) 2024 n8n Community
 * Licensed under the Business Source License 1.1. You may not use this file
 * except in compliance with the License.
 */

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AirtableApi implements ICredentialType {
	name = 'airtableApi';

	displayName = 'Airtable API';

	documentationUrl = 'airtable';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Airtable API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.airtable.com',
			url: '/v0/meta/bases',
			method: 'GET',
		},
	};
}