"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
var node_helper_1 = __importDefault(require("@robbie-cook/node-helper"));
var BranchTools = /** @class */ (function () {
    function BranchTools() {
    }
    /**
     * Main script
     */
    BranchTools.cleanBranches = function () {
        var _this = this;
        node_helper_1.default.execute("git branch --merged master").then(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var unprocessedBranchList, processedBranchList, remove;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unprocessedBranchList = value.replace(/[\n]/g, "").split(" ");
                        processedBranchList = unprocessedBranchList.filter(function (val) { return val && val !== "master" && val !== "production"; });
                        console.log("\nMerged branches:\n");
                        if (processedBranchList.length === 0) {
                            console.log("None! Your branches are clean\n");
                            return [2 /*return*/];
                        }
                        processedBranchList.forEach(function (branch) { return console.log(branch); });
                        return [4 /*yield*/, node_helper_1.default.input("\nWould you like to remove these branches? [y/N]:")];
                    case 1:
                        remove = _a.sent();
                        if (!node_helper_1.default.isAnswerYes(remove)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.removeBranches(processedBranchList)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Remove git branches
     */
    BranchTools.removeBranches = function (branches) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, branches_1, branch, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, branches_1 = branches;
                    _a.label = 1;
                case 1:
                    if (!(_i < branches_1.length)) return [3 /*break*/, 7];
                    branch = branches_1[_i];
                    console.log("Removing " + branch + "...");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, node_helper_1.default.execute("git branch -d " + branch)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 5];
                case 5:
                    console.log(branch + " deleted");
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("Done!\n");
                    return [2 /*return*/];
            }
        });
    }); };
    return BranchTools;
}());
exports.default = BranchTools;
