/*
 * Business Source License 1.1 (BSL 1.1)
 * Copyright (c) 2024 n8n Community
 * Licensed under the Business Source License 1.1. You may not use this file
 * except in compliance with the License.
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Airtable implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Airtable Advanced',
		name: 'airtable',
		icon: 'file:airtable.svg',
		group: ['transform'],
		version: 1,
		description: 'Advanced Airtable integration with formula support',
		defaults: {
			name: 'Airtable Advanced',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'airtableApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Record',
						value: 'create',
						action: 'Create a record',
					},
					{
						name: 'Update Record',
						value: 'update',
						action: 'Update a record',
					},
					{
						name: 'List Records',
						value: 'list',
						action: 'List records',
					},
					{
						name: 'Run Formula',
						value: 'formula',
						action: 'Run a formula',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Base ID',
				name: 'baseId',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'appXXXXXXXXXXXXXX',
				description: 'The ID of the Airtable base',
			},
			{
				displayName: 'Table Name',
				name: 'tableName',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of the table',
			},
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				default: '',
				placeholder: 'recXXXXXXXXXXXXXX',
				description: 'The ID of the record to update',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the field',
							},
							{
								displayName: 'Field Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the field',
							},
						],
					},
				],
			},
			{
				displayName: 'Formula',
				name: 'formula',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						operation: ['formula', 'list'],
					},
				},
				default: '',
				placeholder: 'AND({Status} = "Active", {Priority} > 5)',
				description: 'Airtable formula to filter records',
			},
			{
				displayName: 'Max Records',
				name: 'maxRecords',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 100,
				description: 'Maximum number of records to return',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				default: {},
				options: [
					{
						name: 'sortField',
						displayName: 'Sort Field',
						values: [
							{
								displayName: 'Field',
								name: 'field',
								type: 'string',
								default: '',
								description: 'Field name to sort by',
							},
							{
								displayName: 'Direction',
								name: 'direction',
								type: 'options',
								options: [
									{
										name: 'Ascending',
										value: 'asc',
									},
									{
										name: 'Descending',
										value: 'desc',
									},
								],
								default: 'asc',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('airtableApi');

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const baseId = this.getNodeParameter('baseId', i) as string;
				const tableName = this.getNodeParameter('tableName', i) as string;

				const baseUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
				const headers = {
					Authorization: `Bearer ${credentials.apiKey}`,
					'Content-Type': 'application/json',
				};

				let responseData;

				switch (operation) {
					case 'create': {
						const fields = this.getNodeParameter('fields.field', i, []) as Array<{
							name: string;
							value: string;
						}>;

						const fieldsObject: { [key: string]: any } = {};
						for (const field of fields) {
							fieldsObject[field.name] = field.value;
						}

						const body = {
							fields: fieldsObject,
						};

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: baseUrl,
							headers,
							body,
							json: true,
						});
						break;
					}

					case 'update': {
						const recordId = this.getNodeParameter('recordId', i) as string;
						const fields = this.getNodeParameter('fields.field', i, []) as Array<{
							name: string;
							value: string;
						}>;

						const fieldsObject: { [key: string]: any } = {};
						for (const field of fields) {
							fieldsObject[field.name] = field.value;
						}

						const body = {
							fields: fieldsObject,
						};

						responseData = await this.helpers.httpRequest({
							method: 'PATCH',
							url: `${baseUrl}/${recordId}`,
							headers,
							body,
							json: true,
						});
						break;
					}

					case 'list': {
						const formula = this.getNodeParameter('formula', i, '') as string;
						const maxRecords = this.getNodeParameter('maxRecords', i, 100) as number;
						const sortFields = this.getNodeParameter('sort.sortField', i, []) as Array<{
							field: string;
							direction: string;
						}>;

						const params = new URLSearchParams();
						if (formula) {
							params.append('filterByFormula', formula);
						}
						params.append('maxRecords', maxRecords.toString());

						for (const sortField of sortFields) {
							params.append('sort[0][field]', sortField.field);
							params.append('sort[0][direction]', sortField.direction);
						}

						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}?${params.toString()}`,
							headers,
							json: true,
						});

						if (responseData.records) {
							for (const record of responseData.records) {
								returnData.push({
									json: {
										id: record.id,
										...record.fields,
										createdTime: record.createdTime,
									},
									pairedItem: { item: i },
								});
							}
							continue;
						}
						break;
					}

					case 'formula': {
						const formula = this.getNodeParameter('formula', i) as string;

						const params = new URLSearchParams();
						params.append('filterByFormula', formula);

						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}?${params.toString()}`,
							headers,
							json: true,
						});

						if (responseData.records) {
							for (const record of responseData.records) {
								returnData.push({
									json: {
										id: record.id,
										...record.fields,
										createdTime: record.createdTime,
									},
									pairedItem: { item: i },
								});
							}
							continue;
						}
						break;
					}

					default:
						throw new NodeOperationError(
							this.getNode(),
							`The operation "${operation}" is not supported`,
							{ itemIndex: i },
						);
				}

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}