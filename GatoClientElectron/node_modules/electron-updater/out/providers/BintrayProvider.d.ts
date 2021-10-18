import { BintrayOptions, UpdateInfo } from "builder-util-runtime";
import { ResolvedUpdateFileInfo } from "../main";
import { Provider, ProviderRuntimeOptions } from "./Provider";
export declare class BintrayProvider extends Provider<UpdateInfo> {
    private client;
    private readonly baseUrl;
    constructor(configuration: BintrayOptions, runtimeOptions: ProviderRuntimeOptions);
    setRequestHeaders(value: any): void;
    getLatestVersion(): Promise<UpdateInfo>;
    resolveFiles(updateInfo: UpdateInfo): Array<ResolvedUpdateFileInfo>;
}
