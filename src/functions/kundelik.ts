type KundelikCredentials = {
  login: string;
  password: string;
};

type KundelikRequestInit = RequestInit & {
  token?: string;
};

const kundelikApiBaseUrl = "https://api.kundelik.kz/v2/";
const kundelikClientId = "387d44e3-e0c9-4265-a9e4-a4caaad5111c";
const kundelikClientSecret = "8a7d709c-fdbb-4047-b0ea-8947afe89d67";
const kundelikScope =
  "Schools,Relatives,EduGroups,Lessons,marks,EduWorks,Avatar,EducationalInfo,CommonInfo,ContactInfo,FriendsAndRelatives,Files,Wall,Messages";

type KundelikTokenResponse = {
  accessToken: string;
  expiresIn?: number;
  type?: string;
  description?: string;
};

export type KundelikCurrentUser = {
  id: number;
  personId?: number;
  schoolId?: number;
  [key: string]: unknown;
};

export type KundelikContext = Record<string, unknown>;
export type KundelikEduGroup = Record<string, unknown>;
export type KundelikMark = Record<string, unknown>;
export type KundelikAverageMark = Record<string, unknown>;

function createKundelikUrl(path: string) {
  return new URL(path, kundelikApiBaseUrl).toString();
}

async function parseKundelikResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as
    | T
    | {
        type?: string;
        description?: string;
      };

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "description" in data
        ? data.description
        : "Kundelik request failed.";

    throw new Error(message || "Kundelik request failed.");
  }

  if (
    typeof data === "object" &&
    data &&
    "type" in data &&
    (data.type === "authorizationFailed" ||
      data.type === "parameterInvalid" ||
      data.type === "apiServerError" ||
      data.type === "apiUnknownError")
  ) {
    throw new Error(data.description || "Kundelik returned an API error.");
  }

  return data as T;
}

async function kundelikRequest<T>(
  path: string,
  init: KundelikRequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.token) {
    headers.set("Access-Token", init.token);
  }

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(createKundelikUrl(path), {
    ...init,
    headers,
  });

  return parseKundelikResponse<T>(response);
}

export async function getKundelikToken({
  login,
  password,
}: KundelikCredentials) {
  const tokenResponse = await kundelikRequest<KundelikTokenResponse>(
    "authorizations/bycredentials",
    {
      method: "POST",
      body: JSON.stringify({
        client_id: kundelikClientId,
        client_secret: kundelikClientSecret,
        username: login,
        password,
        scope: kundelikScope,
      }),
    },
  );

  return tokenResponse.accessToken;
}

export async function getKundelikCurrentUser(token: string) {
  return kundelikRequest<KundelikCurrentUser>("users/me", { token });
}

export async function getKundelikContext(token: string) {
  return kundelikRequest<KundelikContext>("users/me/context", { token });
}

export async function getKundelikEduGroups(token: string) {
  return kundelikRequest<KundelikEduGroup[]>("users/me/edu-groups", { token });
}

export async function getKundelikPersonMarks(params: {
  token: string;
  personId: number;
  schoolId: number;
  startDate: string;
  endDate: string;
}) {
  const { token, personId, schoolId, startDate, endDate } = params;

  return kundelikRequest<KundelikMark[]>(
    `persons/${personId}/schools/${schoolId}/marks/${startDate}/${endDate}`,
    { token },
  );
}

export async function getKundelikPersonAverageMarks(params: {
  token: string;
  personId: number;
  periodId: number;
}) {
  const { token, personId, periodId } = params;

  return kundelikRequest<KundelikAverageMark[]>(
    `persons/${personId}/reporting-periods/${periodId}/avg-mark`,
    { token },
  );
}

export async function createKundelikSession(credentials: KundelikCredentials) {
  const token = await getKundelikToken(credentials);

  return {
    token,
    getCurrentUser: () => getKundelikCurrentUser(token),
    getContext: () => getKundelikContext(token),
    getEduGroups: () => getKundelikEduGroups(token),
    getPersonMarks: (params: {
      personId: number;
      schoolId: number;
      startDate: string;
      endDate: string;
    }) => getKundelikPersonMarks({ token, ...params }),
    getPersonAverageMarks: (params: { personId: number; periodId: number }) =>
      getKundelikPersonAverageMarks({ token, ...params }),
  };
}
