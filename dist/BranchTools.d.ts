export default class BranchTools {
    /**
     * Remove git branches
     */
    static removeBranches: (branches: Array<string>) => Promise<void>;
    /**
     *
     * Main script
     */
    static cleanBranches(): Promise<void>;
}
