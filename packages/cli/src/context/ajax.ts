import history from "./history";

const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json"
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFetch = async (input: string, init?: RequestInit): Promise<any> => {
    init = init || {};
    init.headers = init.headers || {};
    init.headers = { ...init.headers, ...defaultHeaders };
    const fetchRes = await fetch(input, init);
    if (fetchRes.status >= 400) {
        if (fetchRes.status === 401) {
            history.replace("/login");
            return null;
        }
        return throwErrorMessage(fetchRes);
    }
    const responseText = await fetchRes.text();
    const jsonData = tryJsonParse(responseText);
    return jsonData || { $text: responseText };
};

async function throwErrorMessage(response: Response) {
    let responseText = await response.text();
    if (responseText) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = tryJsonParse(responseText) as any;
        if (data && data.message) {
            responseText = data.message as string;
        }
    } else {
        responseText = "Erreur serveur";
    }
    throw new Error(responseText);
}
function tryJsonParse(text: string) {
    try {
        const data = JSON.parse(text);
        return data;
    } catch {
        return null;
    }
}
