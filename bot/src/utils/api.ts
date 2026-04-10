import { env } from "../config/env.js";

export interface ApiUser {
	id: number;
	username: string;
}

export class ApiError extends Error {
	constructor(message: string, public readonly status: number) {
		super(message);
		this.name = "ApiError";
	}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const url = `${env.API_BASE_URL.replace(/\/$/, "")}${path}`;
	const res = await fetch(url, {
		...init,
		headers: {
			"Accept": "application/json",
			...(init?.headers ?? {}),
		},
	});

	if (!res.ok) {
		let message = `API request failed: ${res.status} ${res.statusText}`;
		try {
			const body = await res.json() as { error?: string };
			if (body?.error) message = body.error;
		} catch {
			// ignore body parse errors
		}
		throw new ApiError(message, res.status);
	}

	return res.json() as Promise<T>;
}

export const api = {
	getUserById: (id: string | number): Promise<ApiUser> =>
		request<ApiUser>(`/api/v1/users/${encodeURIComponent(String(id))}`),

	upsertUser: (id: string | number, username: string): Promise<ApiUser> =>
		request<ApiUser>("/api/v1/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: String(id), username }),
		}),
};
