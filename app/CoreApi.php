<?php

declare(strict_types=1);

namespace App;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorLabelProvider;
use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\ActorVisibilityProvider;
use App\Actors\Contracts\AdmittedRecipients;
use App\Actors\Contracts\AuthoritySource;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Contracts\TargetAuthorizer;
use App\Actors\Contracts\UserPresences;
use App\Actors\Contracts\WorkStackProvider;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\ActiveActorCounterRepeated;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Exceptions\ActorProviderRepeated;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Exceptions\AgentActorRequired;
use App\Actors\Exceptions\AuthorizerProviderRepeated;
use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Actors\Exceptions\CrossOwnerReadRefused;
use App\Actors\Exceptions\EngineActorRequired;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorLabelSet;
use App\Actors\Support\AllowsEverything;
use App\Actors\Support\CurrentUser;
use App\Actors\Values\OwnerAuthority;
use App\Actors\Values\PolicyRegistration;
use App\Actors\Values\TrustedEntryAuthority;
use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\AgentRequests\Support\AgentReply;
use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Commands\CreateAgent;
use App\Agents\Commands\DeliverAgent;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\InterruptAgent;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\RunKeyScript;
use App\Agents\Commands\StopAgent;
use App\Agents\Commands\WakeAgent;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Contracts\ConversationVisits;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\LaunchExecutor;
use App\Agents\Contracts\LaunchReadiness;
use App\Agents\Contracts\LaunchRecordResolver;
use App\Agents\Contracts\NativeTurnRecords;
use App\Agents\Contracts\ProgramConversationResolver;
use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Data\DriverRequestStatus;
use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\LaunchDisposition;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\ReservationState;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Events\LaunchAccepted;
use App\Agents\Events\LaunchEnded;
use App\Agents\Exceptions\AccessPolicyInvalid;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Exceptions\AgentNameRequired;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Exceptions\DefaultUnavailable;
use App\Agents\Exceptions\ExecutionBudgetInvalid;
use App\Agents\Exceptions\ExecutionPolicyInvalid;
use App\Agents\Exceptions\HostCapabilityUnsupported;
use App\Agents\Exceptions\ImageUnverified;
use App\Agents\Exceptions\LaunchRecordMissing;
use App\Agents\Exceptions\LaunchRequestConflict;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Exceptions\ModelRequired;
use App\Agents\Exceptions\ModelUnavailable;
use App\Agents\Exceptions\ProgramConflict;
use App\Agents\Exceptions\ProgramRequired;
use App\Agents\Exceptions\ProgramUnsupported;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Exceptions\StopConditionsInvalid;
use App\Agents\Support\AgentLabel;
use App\Agents\Support\ClaimedRequest;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\ContainerManifest;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Support\ExecutionReceipt;
use App\Agents\Support\ExecutionReference;
use App\Agents\Support\ExitReceipt;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRecordDetails;
use App\Agents\Support\LaunchRequest;
use App\Agents\Support\ManifestMount;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Support\PreparedLaunch;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\ProgramConversationSummary;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\SelectionSource;
use App\Agents\Support\SessionOption;
use App\Agents\Support\StackTarget;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\Operation as PolicyOperation;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\ResourceRequest;
use App\Agents\Values\ScriptParameter;
use App\Agents\Values\ScriptProgress;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ConfigureAutoAssignment;
use App\Assignments\Commands\DisableAutoAssignment;
use App\Assignments\Commands\EnableAutoAssignment;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AssignmentPoolFactory;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\AutoAssigner;
use App\Assignments\Contracts\AutoAssignmentActivity;
use App\Assignments\Contracts\ProvidesAutoAssignments;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Enums\PoolInputType;
use App\Assignments\Enums\PoolMembersType;
use App\Assignments\Events\AssignmentsChanged;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Assignments\Exceptions\AssignmentPoolTooLarge;
use App\Assignments\Exceptions\AssignmentPoolUnavailable;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Exceptions\AutoAssignmentSizeInvalid;
use App\Assignments\Exceptions\InvalidAssignmentIdentity;
use App\Assignments\Exceptions\InvalidAssignmentPage;
use App\Assignments\Exceptions\InvalidRecordIds;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\AssigneeList;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\AssigneeRegistration;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentChange;
use App\Assignments\Support\AssignmentData;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\AssignmentHolders;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\AssignmentSet;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\NumberedPage;
use App\Assignments\Support\OrderedRecordIds;
use App\Assignments\Support\Page;
use App\Assignments\Support\PoolDefinition;
use App\Assignments\Support\PoolDescription;
use App\Assignments\Support\PoolMembers;
use App\Assignments\Support\PoolReference;
use App\Assignments\Support\RecordIds;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\DeclaresClassLevelAbilities;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Contracts\OperationResolver;
use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Enums\CommandScopeType;
use App\Bus\Enums\MiddlewareStage;
use App\Bus\Enums\ReceiptState;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandHandlerTwice;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\CommandNestingTooDeep;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\CommandReplacedWithOtherClass;
use App\Bus\Exceptions\CommandReplacementRefused;
use App\Bus\Exceptions\CommandResultChanged;
use App\Bus\Exceptions\CommandRetryExhausted;
use App\Bus\Exceptions\CommandTransactionMismatch;
use App\Bus\Exceptions\CommandTransactionMissing;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Bus\Exceptions\ContinuationCalledTwice;
use App\Bus\Exceptions\DomainDisabled;
use App\Bus\Exceptions\ExplicitTransactionInCommand;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use App\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Bus\Exceptions\MiddlewareSwallowedFailure;
use App\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\Operation;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Comments\Contracts\Commentable;
use App\Comments\Contracts\CommentResolver;
use App\Comments\Contracts\PublicCommentResolver;
use App\Comments\Data\CommentDetails;
use App\Comments\Data\CommentList;
use App\Comments\Data\RecordCommentLocation;
use App\Comments\Data\RecordCommentView;
use App\Comments\Data\TextCommentLocation;
use App\Comments\Data\TextCommentView;
use App\Comments\Enums\CommentType;
use App\Comments\Enums\WholeRecord;
use App\Comments\Events\CommentPosted;
use App\Comments\Exceptions\CommentUnavailable;
use App\Comments\Exceptions\SubmissionKeyConflict;
use App\Comments\Exceptions\TargetNotCommentable;
use App\Comments\Support\HasComments;
use App\Comments\Support\PublicComment;
use App\Comments\Support\PublicCommentPage;
use App\Communication\Commands\AnswerMessage;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SendMessage;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\MessageAddressResolver;
use App\Communication\Data\Conversation;
use App\Communication\Data\MessageView;
use App\Communication\Enums\MessageState;
use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\ActorCannotSend;
use App\Communication\Exceptions\MessageBodyEmpty;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Support\MessageAddress;
use App\Contracts\CommandHandler;
use App\Contracts\CommandRefusal;
use App\Contracts\DomainAvailability;
use App\Contracts\Event;
use App\Contracts\Listener;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Commands\SettleFrameTimes;
use App\Engine\Events\EngineTicked;
use App\Engine\Values\FrameSettlement;
use App\Exports\Exceptions\MalformedExports;
use App\Exports\Support\ExportBuilder;
use App\Exports\Support\Exports;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\Answer;
use App\Hooks\Contracts\ConditionalState;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\ReminderContribution;
use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\StackTransition;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\StateRegistration;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SessionEndReason;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\MonotonicClockWentBack;
use App\Hooks\Exceptions\StackTransactionRequired;
use App\Hooks\Exceptions\StateReferencesInvalid;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\Exceptions\StateTypeMissing;
use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypesFrozen;
use App\Hooks\Inputs\CompactionDetails;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileChange;
use App\Hooks\Inputs\FileChanges;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\PromptDetails;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEndDetails;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStartDetails;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\Models\Support\BelongsToOneAgent;
use App\Hooks\States\AgentState;
use App\Hooks\Ticks\ElapsedTime;
use App\Http\Data\Assignments\RecordHolderData;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Links\Events\LinksRemoved;
use App\Links\Exceptions\UnknownLinkType;
use App\Links\Support\Linkable;
use App\Links\Support\LinkAccess;
use App\Links\Support\LinkTypeRegistry;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Contracts\ProvidesMcpTools;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use App\Mcp\Data\ToolResult as McpToolResult;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Exceptions\ResourceMimeTypeRefused;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Mcp\Tools\JournalTool;
use App\Numbers\Commands\InstallNumbers;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Exceptions\InvalidRecordReference;
use App\Numbers\Support\HasNumber;
use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\RecordReference;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Operations\Exceptions\UnknownAccessType;
use App\Operations\Exceptions\UnknownResourceArea;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Commands\IssueEvidencePermit;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\RevokeCommandPermissions;
use App\Processes\Commands\WithdrawCommandRequest;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\FactOrigin;
use App\Processes\Contracts\ProgramClassifier;
use App\Processes\Contracts\ProvidesCommandRules;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Data\ClassificationSummaryData;
use App\Processes\Data\PartSummaryData;
use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\AssessmentOutcome;
use App\Processes\Enums\BindingType;
use App\Processes\Enums\ClaimedOutcome;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandEffect;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\EmptyPolicy;
use App\Processes\Enums\EmptySelection;
use App\Processes\Enums\FramingType;
use App\Processes\Enums\JournalRouteType;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\OperandType;
use App\Processes\Enums\Outcome;
use App\Processes\Enums\OutputEncoding;
use App\Processes\Enums\OutputRequirement;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ProgressType;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Enums\ScopeType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\StreamUse;
use App\Processes\Enums\SummaryRule;
use App\Processes\Enums\ToolType;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Enums\WordSegmentType;
use App\Processes\Exceptions\CommandRuleConflict;
use App\Processes\Exceptions\CommandRuleInvalid;
use App\Processes\Exceptions\ShellNodeMissing;
use App\Processes\Exceptions\VerificationContractInvalid;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\ClassFact;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandOperation;
use App\Processes\Values\CommandPart;
use App\Processes\Values\CommandPattern;
use App\Processes\Values\CommandRule;
use App\Processes\Values\EmptyRunPolicy;
use App\Processes\Values\ExecutableBinding;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ExitBranch;
use App\Processes\Values\ExitPolicy;
use App\Processes\Values\HereDocument;
use App\Processes\Values\NextStep;
use App\Processes\Values\OptionGrammar;
use App\Processes\Values\OutputContract;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ProgramIdentity;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\ProgressPolicy;
use App\Processes\Values\PublishedResult;
use App\Processes\Values\ReaderReference;
use App\Processes\Values\Redirect;
use App\Processes\Values\RuleOrigin;
use App\Processes\Values\RuleReference;
use App\Processes\Values\RuleScope;
use App\Processes\Values\ShellCommand;
use App\Processes\Values\ShellNode;
use App\Processes\Values\ShellTree;
use App\Processes\Values\SourceRange;
use App\Processes\Values\SyntaxOrigin;
use App\Processes\Values\TimingVerdict;
use App\Processes\Values\TreeDiagnostic;
use App\Processes\Values\UnresolvedFact;
use App\Processes\Values\Word;
use App\Processes\Values\WordSegment;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\LaunchProfileMain;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileChangeType;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Exceptions\ProfileFieldUnknown;
use App\Profiles\Exceptions\ProfileKeyInvalid;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Exceptions\ProfileRevisionUnreadable;
use App\Profiles\Exceptions\ProfileTypeConflict;
use App\Profiles\Support\ClassRule;
use App\Profiles\Support\OperationRule;
use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Support\TypeOverride;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ActivatedProfile;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\LaunchProfileAuthority;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileAuthorization;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileLaunchPolicy;
use App\Profiles\Values\ProfileProvenance;
use App\Profiles\Values\ProfileSelection;
use App\Profiles\Values\ProfileSnapshot;
use App\Programs\Enums\HookProgram;
use App\Programs\Exceptions\ProgramKeyInvalid;
use App\Programs\Exceptions\ProviderKeyInvalid;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;
use App\Queries\Support\TextSearch;
use App\Reads\Attributes\ReadBudget;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Contracts\ReadMeter;
use App\Reads\Enums\ReadMode;
use App\Reads\Exceptions\LazyLoadRefused;
use App\Reads\Exceptions\ModelReadAllRefused;
use App\Reads\Exceptions\QueryInValueRead;
use App\Reads\Exceptions\ReadLimitExceeded;
use App\Reads\Exceptions\ReadLimitInvalid;
use App\Reads\Exceptions\ReadLimitTooLarge;
use App\Reads\Exceptions\ReadPolicyMissing;
use App\Reads\Exceptions\ReadReasonMissing;
use App\Reads\Exceptions\ReadShapeUnsupported;
use App\Reads\Exceptions\RelationReadUndeclared;
use App\Reads\Support\BoundedReads;
use App\Reads\Support\CountsLoads;
use App\Reads\Support\CountsPivotLoads;
use App\Reads\Support\ReadBuilder;
use App\Reads\Values\Measurement;
use App\Reads\Values\PageSize;
use App\Reads\Values\ReadCounts;
use App\Reads\Values\ReadOrder;
use App\Reads\Values\RelationRead;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;
use App\Records\Contracts\RecordLinker;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordResolver;
use App\Records\Data\RecordCard;
use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\ProvidesModelRecords;
use App\Records\Support\RecordIdentity;
use App\Settings\Commands\DisableSettingGroup;
use App\Settings\Commands\EnableSettingGroup;
use App\Settings\Commands\ResetSetting;
use App\Settings\Commands\ResetSettingGroup;
use App\Settings\Commands\SetBooleanSetting;
use App\Settings\Commands\SetDecimalSetting;
use App\Settings\Commands\SetIntegerChoice;
use App\Settings\Commands\SetIntegerSetting;
use App\Settings\Commands\SetStringChoice;
use App\Settings\Commands\SetStringSetting;
use App\Settings\Contracts\CatalogueConstraints;
use App\Settings\Contracts\CatalogueValue;
use App\Settings\Contracts\ChoiceLabel;
use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\ProvidesSettings;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\Contracts\SettingsSnapshot;
use App\Settings\Data\BooleanValueData;
use App\Settings\Data\DecimalConstraintsData;
use App\Settings\Data\DecimalValueData;
use App\Settings\Data\IntegerChoiceConstraintsData;
use App\Settings\Data\IntegerChoiceOptionData;
use App\Settings\Data\IntegerChoiceValueData;
use App\Settings\Data\IntegerConstraintsData;
use App\Settings\Data\IntegerValueData;
use App\Settings\Data\InvalidValueData;
use App\Settings\Data\PlainGroupAvailabilityData;
use App\Settings\Data\SettingData;
use App\Settings\Data\SettingGroupData;
use App\Settings\Data\SettingIdentityData;
use App\Settings\Data\SettingsCatalogueData;
use App\Settings\Data\StringChoiceConstraintsData;
use App\Settings\Data\StringChoiceOptionData;
use App\Settings\Data\StringChoiceValueData;
use App\Settings\Data\StringConstraintsData;
use App\Settings\Data\StringValueData;
use App\Settings\Data\ToggleGroupAvailabilityData;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Enums\GroupAvailability;
use App\Settings\Enums\SettingAvailability;
use App\Settings\Enums\SettingSource;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Enums\SettingTarget;
use App\Settings\Enums\SettingType;
use App\Settings\Events\SettingsChanged;
use App\Settings\Exceptions\DecimalInvalid;
use App\Settings\Exceptions\GroupSnapshotRequired;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Exceptions\SettingDisabled;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\Exceptions\SettingReferenceInvalid;
use App\Settings\Exceptions\SettingsAccessDenied;
use App\Settings\Exceptions\SettingsConflict;
use App\Settings\Exceptions\SettingsDocumentInvalid;
use App\Settings\Exceptions\SettingsOwnerUnknown;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\Exceptions\SettingsUnavailable;
use App\Settings\Exceptions\SettingUnavailable;
use App\Settings\Exceptions\SettingValueInvalid;
use App\Settings\Support\CurrentSettingsResolver;
use App\Settings\Support\DisabledSettingsGroup;
use App\Settings\Values\Choice;
use App\Settings\Values\Decimal;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\DisableShareGateway;
use App\Sharing\Commands\RefreshShareScope;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Commands\RetryShare;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareBudget;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Sharing\Enums\ShareRelationType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareCreated;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Events\ShareGatewayChanged;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Events\ShareScopeChanged;
use App\Sharing\Exceptions\ShareBudgetExceeded;
use App\Sharing\Exceptions\SharePreviewRefused;
use App\Sharing\Exceptions\SharingNotAllowed;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayHealth;
use App\Sharing\Support\GatewayOperation;
use App\Sharing\Support\GatewayReadiness;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\SharedContent;
use App\Sharing\Support\SharedPage;
use App\Sharing\Support\SharedPageItem;
use App\Sharing\Support\ShareFact;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareProposalStatus;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecordRegistration;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelation;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareRelationSet;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareSummary;
use App\Sharing\Support\ShareTargetRead;
use App\Skills\Commands\CopySkill;
use App\Skills\Commands\CreateSkill;
use App\Skills\Commands\RestoreSkill;
use App\Skills\Commands\RetireSkill;
use App\Skills\Commands\ReviseSkill;
use App\Skills\Conditions\AgentTypes;
use App\Skills\Conditions\AllOf;
use App\Skills\Conditions\AnyOf;
use App\Skills\Conditions\Conditions;
use App\Skills\Conditions\Environments;
use App\Skills\Conditions\Everyone;
use App\Skills\Conditions\MainAgent;
use App\Skills\Conditions\Named;
use App\Skills\Conditions\Not;
use App\Skills\Conditions\Profiles;
use App\Skills\Conditions\Programs;
use App\Skills\Conditions\Providers;
use App\Skills\Contracts\ProvidesSkillConditions;
use App\Skills\Contracts\ProvidesSkills;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Contracts\SkillConditionEvaluator;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Enums\SkillOrigin;
use App\Skills\Exceptions\ShippedSkillReadOnly;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Exceptions\SkillKeyTaken;
use App\Skills\Exceptions\SkillOwnerRequired;
use App\Skills\Exceptions\SkillRequestReused;
use App\Skills\Exceptions\SkillRetired;
use App\Skills\Exceptions\SkillRevisionConflict;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Support\MarkdownParts;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\LaunchProfile;
use App\Skills\Values\MarkdownPart;
use App\Skills\Values\RenderedSkill;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillConditionRegistration;
use App\Skills\Values\SkillContext;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillRevisionResult;
use App\Skills\Values\SkillSection;
use App\Text\Contracts\TextContent;
use App\Text\Contracts\TextResolver;
use App\Text\Data\TextSections;
use App\Text\Data\TextVersionInfo;
use App\Text\Enums\TextAnchorType;
use App\Text\Exceptions\AnchorMismatch;
use App\Text\Exceptions\ContentMissing;
use App\Text\Exceptions\ContentTooLarge;
use App\Text\Exceptions\IncompleteTextAnchor;
use App\Text\Exceptions\InvalidTextRange;
use App\Text\Exceptions\MarkdownInvalid;
use App\Text\Exceptions\SectionMissing;
use App\Text\Exceptions\TargetHasNoText;
use App\Text\Exceptions\TextLineTooLong;
use App\Text\Exceptions\TextMatchInvalid;
use App\Text\Exceptions\TextSelectionRefused;
use App\Text\Exceptions\TextVersionUnavailable;
use App\Text\Support\MarkdownText;
use App\Text\Support\Section as TextSection;
use App\Text\Support\TextPart;
use App\Text\Support\TextReading;
use App\Text\Support\TextSelection;
use App\Text\Values\TextAnchor;
use App\Text\Values\TextRange;
use App\Text\Values\TextVersion;
use App\Ui\Contracts\CountResolver;
use App\Ui\Contracts\NavigationChildren;
use App\Ui\Contracts\PageOption;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Contracts\UpdatesUserInterface;
use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\ChoiceOption;
use App\Ui\Declarations\FloatSize;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page as UiPage;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Declarations\SlotContext;
use App\Ui\Declarations\ToggleOption;
use App\Ui\Enums\ActionMethod;
use App\Ui\Enums\Icon;
use App\Ui\Enums\PageDestination;
use App\Ui\Enums\PageSkeleton;
use App\Ui\Enums\SlotContextType;
use App\Web\Commands\RecordUserHeartbeat;
use App\Web\Contracts\CurrentUserResolver;

/**
 * Core's public surface: every type a domain or module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 * CurrentActorSetter and LinkTypeRegistry are listed for the few places that compose the application (the
 * sign-in middleware and owner providers), not for ordinary use.
 */
final class CoreApi
{
    public static function exports(): Exports
    {
        return Exports::make()
            ->events(
                LinksRemoved::class,
                CommentPosted::class,
                MessageSent::class,
                MessageAnswered::class,
                MessageDismissed::class,
                ContextStarted::class,
                StateTypesRequested::class,
                AssignmentsChanged::class,
                LaunchEnded::class,
                ProfileRevisionRevoked::class,
                LaunchAccepted::class,
                EngineTicked::class,
                SettingsChanged::class,
                ShareRequested::class,
                ShareCreated::class,
                ShareActivated::class,
                ShareFailed::class,
                ShareScopeChanged::class,
                ShareRevoked::class,
                ShareExpired::class,
                ShareGatewayChanged::class,
            )
            ->contracts(
                RecordProvider::class,
                RecordResolver::class,
                RecordLinker::class,
                CurrentSession::class,
                ConversationVisits::class,
                AutoAssignmentActivity::class,
                NativeTurnRecords::class,
                ReadableModel::class,
                ReadMeter::class,
                Actor::class,
                CurrentActor::class,
                CurrentActorSetter::class,
                AgentResolver::class,
                SessionResolver::class,
                LaunchReadiness::class,
                LaunchExecutor::class,
                HostCapabilities::class,
                LaunchRecordResolver::class,
                ProgramConversationResolver::class,
                HelperImages::class,
                RecordVisibility::class,
                RuntimeResolver::class,
                AgentStack::class,
                UserStack::class,
                StackTransactionRunner::class,
                StateLoader::class,
                Answer::class,
                StackTransition::class,
                StackEditor::class,
                CurrentState::class,
                TextContent::class,
                TextResolver::class,
                Commentable::class,
                SendsMessages::class,
                ReceivesMessages::class,
                ActorResolver::class,
                ActorProvider::class,
                ActorProviderRegistration::class,
                ActorLabels::class,
                Policy::class,
                PolicyCatalogue::class,
                ProvidesPolicies::class,
                WorkStackProvider::class,
                HasAuthorizationSubject::class,
                DeclaresClassLevelAbilities::class,
                Authorizer::class,
                AuthorizerProvider::class,
                AuthorizerProviderRegistration::class,
                CurrentAuthorizer::class,
                TargetAuthorizer::class,
                AuthoritySource::class,
                ActorLabelProvider::class,
                ActorVisibility::class,
                ActorVisibilityProvider::class,
                ActiveActorRegistration::class,
                ActiveActorCounter::class,
                UserPresences::class,
                MessageAddressResolver::class,
                ConversationResolver::class,
                CommentResolver::class,
                ShellCommandParser::class,
                CommandClassifier::class,
                ProvidesCommandRules::class,
                ProgramClassifier::class,
                FactOrigin::class,
                ResultReceipts::class,
                VerificationTiming::class,
                HookAnswerer::class,
                HookInput::class,
                StateRegistration::class,
                ConditionalState::class,
                ConditionalStateType::class,
                DomainAvailability::class,
                ReminderContribution::class,
                Assignee::class,
                Assignable::class,
                AssignableProvider::class,
                AssigneeProvider::class,
                AssignmentResolver::class,
                AssignmentRegistration::class,
                AgentRequestSender::class,
                Numbered::class,
                ProvidesNumberedModels::class,
                AssigneeResolver::class,
                AssignmentWriter::class,
                AssignmentTransaction::class,
                AutoAssigner::class,
                AssignmentPool::class,
                AssignmentPoolFactory::class,
                AssignedWorkResolver::class,
                AssignedWorkProvider::class,
                AssignmentQuery::class,
                ProvidesAutoAssignments::class,
                CurrentUserResolver::class,
                Command::class,
                CommandBus::class,
                CommandMiddleware::class,
                CommandRefusal::class,
                Event::class,
                Listener::class,
                CommandHandler::class,
                ProvidesCommands::class,
                ProvidesMcpTools::class,
                McpCall::class,
                NumberedPages::class,
                ProvidesCommandMiddleware::class,
                AdmittedRecipients::class,
                JournalAdmission::class,
                UpdatesUserInterface::class,
                CountResolver::class,
                NavigationChildren::class,
                PageOption::class,
                PageResolver::class,
                ProvidesNavigation::class,
                ProvidesPages::class,
                ProvidesSections::class,
                SectionResolver::class,
                VisibilityCheck::class,
                ProvidesSettings::class,
                Setting::class,
                CatalogueValue::class,
                CatalogueConstraints::class,
                SettingsDefinition::class,
                GroupDeclaration::class,
                ChoiceLabel::class,
                Shareable::class,
                ShareRecordProvider::class,
                ShareBudget::class,
                ShareGateway::class,
                ProvidesShareRecords::class,
                ProvidesShareGateways::class,
                SharePolicy::class,
                ShareStatusResolver::class,
                PublicCommentResolver::class,
                SettingsResolver::class,
                SettingCommands::class,
                SettingsSnapshot::class,
                EnabledSettingsGroup::class,
                SettingsCatalogue::class,
                SettingsAccessPolicy::class,
                CodedRefusal::class,
                OperationResolver::class,
                OverviewContribution::class,
                ProfileResolver::class,
                ProfileSelections::class,
                ProvidesSkills::class,
                Skill::class,
                SkillCondition::class,
                ProvidesSkillConditions::class,
                SkillResolver::class,
                SkillConditionEvaluator::class,
            )
            ->values(
                RefusalCode::class,
                ReceiptState::class,
                Operation::class,
                McpToolResult::class,
                NextAction::class,
                OverviewSection::class,
                ListedPage::class,
                AgentRole::class,
                HookProgram::class,
                PreparedLaunch::class,
                ExecutionReceipt::class,
                ExecutionReference::class,
                ExitReceipt::class,
                HostCapabilityQuery::class,
                HostCapability::class,
                CapabilityStatusType::class,
                ExecutionModeType::class,
                AccountModeType::class,
                HostCapabilityType::class,
                SelectedProgram::class,
                ModelSelection::class,
                SelectionSource::class,
                ProfileDefaults::class,
                ModelSelectionType::class,
                ProgramSourceType::class,
                LaunchRefusalType::class,
                LaunchRequest::class,
                LaunchReceipt::class,
                LaunchRecordDetails::class,
                ProgramConversationSummary::class,
                ContainerManifest::class,
                ManifestMount::class,
                HostCapacity::class,
                ReservationState::class,
                LaunchOriginType::class,
                ConversationModeType::class,
                LaunchDisposition::class,
                AccessType::class,
                ResourceAreaType::class,
                AccessRuleType::class,
                ResourceRequest::class,
                PolicyOperation::class,
                OperationGrant::class,
                ClassGrant::class,
                AccessDecision::class,
                AccessPolicy::class,
                StopCondition::class,
                StopConditions::class,
                ExecutionBudgets::class,
                ExecutionPolicy::class,
                ToolArguments::class,
                RecordCard::class,
                StateReferences::class,
                StateSet::class,
                ReadMode::class,
                ReadOrder::class,
                PageSize::class,
                RelationRead::class,
                ReadBudget::class,
                ReadCounts::class,
                Measurement::class,
                ActorType::class,
                ActorContext::class,
                AgentLabel::class,
                SessionOption::class,
                StackTarget::class,
                Decision::class,
                AnswerType::class,
                TransitionType::class,
                StateReference::class,
                LifecycleContext::class,
                TextSection::class,
                TextPart::class,
                TextVersionInfo::class,
                TextSections::class,
                TextSelection::class,
                MarkdownText::class,
                TextReading::class,
                TextVersion::class,
                TextRange::class,
                TextAnchor::class,
                TextAnchorType::class,
                WholeRecord::class,
                CommentType::class,
                MessageAddress::class,
                Conversation::class,
                MessageView::class,
                MessageState::class,
                CommentDetails::class,
                RecordCommentView::class,
                TextCommentView::class,
                RecordCommentLocation::class,
                TextCommentLocation::class,
                CommentList::class,
                NoSubject::class,
                SubjectReference::class,
                ContextCompacted::class,
                CompactionDetails::class,
                ContextStartType::class,
                FileEditRequested::class,
                FileChanges::class,
                FileChange::class,
                FileOperation::class,
                HookIdentity::class,
                PromptSubmitted::class,
                PromptDetails::class,
                SessionEnded::class,
                SessionEndDetails::class,
                SessionEndReason::class,
                SessionStarted::class,
                SessionStartDetails::class,
                SessionStartSource::class,
                ShellCommandRequested::class,
                ShellCommand::class,
                CommandPart::class,
                CommandClass::class,
                JournalRoute::class,
                JournalRouteType::class,
                CommandRule::class,
                RuleScope::class,
                TimingVerdict::class,
                PublishedResult::class,
                AssessmentOutcome::class,
                ScopeType::class,
                ProgramSpellings::class,
                ArgumentGrammar::class,
                OptionGrammar::class,
                OperandType::class,
                ExecutableBinding::class,
                BindingType::class,
                RuleReference::class,
                ProgramIdentity::class,
                CommandPattern::class,
                RequestHoldReason::class,
                RequestState::class,
                NextStep::class,
                VerificationContract::class,
                ToolType::class,
                OutputEncoding::class,
                FramingType::class,
                StreamUse::class,
                EmptyPolicy::class,
                Outcome::class,
                ClaimedOutcome::class,
                SummaryRule::class,
                EmptySelection::class,
                ProgressType::class,
                EmptyRunPolicy::class,
                OutputContract::class,
                ExitBranch::class,
                ExitPolicy::class,
                ProgressPolicy::class,
                ReaderReference::class,
                CommandOperation::class,
                CommandClassSet::class,
                Classification::class,
                ClassificationSummaryData::class,
                PartClassification::class,
                PartSummaryData::class,
                ClassFact::class,
                UnresolvedFact::class,
                UnresolvedType::class,
                OutputRequirement::class,
                RuleOrigin::class,
                SyntaxOrigin::class,
                ExecutionContext::class,
                ShellTree::class,
                ShellNode::class,
                SourceRange::class,
                Word::class,
                WordSegment::class,
                Redirect::class,
                HereDocument::class,
                TreeDiagnostic::class,
                NodeType::class,
                WordSegmentType::class,
                RedirectType::class,
                CommandType::class,
                CommandEffect::class,
                PartJoin::class,
                ShellDialect::class,
                ParseOutcome::class,
                StopRequested::class,
                StopDetails::class,
                ToolFinished::class,
                ToolResult::class,
                ToolOutcome::class,
                ActorIdentity::class,
                PolicyRegistration::class,
                ActorLabelSet::class,
                AllowsEverything::class,
                LaunchProfileAuthority::class,
                OwnerAuthority::class,
                TrustedEntryAuthority::class,
                RecordIdentity::class,
                AssigneeRegistration::class,
                Assignment::class,
                AssignmentReference::class,
                AssignmentSet::class,
                AssignmentGroup::class,
                AssignmentResult::class,
                AssignmentOutcome::class,
                AssignmentChange::class,
                Page::class,
                RecordIds::class,
                OrderedRecordIds::class,
                PoolReference::class,
                PoolMembers::class,
                PoolMembersType::class,
                PoolDefinition::class,
                PoolDescription::class,
                PoolInputType::class,
                AutoAssignerDefinition::class,
                AssigneeList::class,
                AssigneeName::class,
                AssignmentReason::class,
                AssignmentOutcomeType::class,
                AssignmentData::class,
                RecordHolderData::class,
                AgentReply::class,
                NumberedModel::class,
                RecordReference::class,
                Exports::class,
                ExportBuilder::class,
                NumberedPage::class,
                AssignmentHolders::class,
                AssignmentHolder::class,
                HandledBy::class,
                RepeatableRead::class,
                RequiresActor::class,
                RequiresRequestKey::class,
                ElapsedTime::class,
                FrameSettlement::class,
                MiddlewareStage::class,
                CommandScopeType::class,
                CommandScope::class,
                MiddlewareDeclaration::class,
                Authorize::class,
                CommandCall::class,
                CurrentUser::class,
                ActionRoute::class,
                ChoiceOption::class,
                FloatSize::class,
                NavigationItem::class,
                UiPage::class,
                Section::class,
                Slot::class,
                SlotContext::class,
                ToggleOption::class,
                ActionMethod::class,
                Icon::class,
                PageDestination::class,
                PageSkeleton::class,
                SlotContextType::class,
                StringSetting::class,
                SettingGroup::class,
                ToggleGroup::class,
                BooleanSetting::class,
                IntegerSetting::class,
                DecimalSetting::class,
                Decimal::class,
                ChoiceSetting::class,
                EnumSetting::class,
                Choice::class,
                SettingType::class,
                ShareRelationSet::class,
                ShareRelation::class,
                ShareRecordRegistration::class,
                ShareSelection::class,
                ShareCandidates::class,
                ShareLinkedCandidate::class,
                ShareRecordCard::class,
                ShareRecords::class,
                ShareTargetRead::class,
                ShareRelationRead::class,
                ShareContentRead::class,
                SharedContent::class,
                ShareSelectedTarget::class,
                GatewayConfiguration::class,
                GatewaySettings::class,
                GatewayOperation::class,
                GatewayEndpoint::class,
                GatewayReadiness::class,
                GatewayHealth::class,
                ShareRelationType::class,
                SharedPage::class,
                SharedPageItem::class,
                PublicComment::class,
                PublicCommentPage::class,
                SettingSource::class,
                CurrentSettingsResolver::class,
                SettingTarget::class,
                GroupAvailability::class,
                SettingAvailability::class,
                SettingsCatalogueData::class,
                SettingGroupData::class,
                SettingData::class,
                SettingIdentityData::class,
                PlainGroupAvailabilityData::class,
                ToggleGroupAvailabilityData::class,
                StringConstraintsData::class,
                IntegerConstraintsData::class,
                DecimalConstraintsData::class,
                StringChoiceConstraintsData::class,
                IntegerChoiceConstraintsData::class,
                StringChoiceOptionData::class,
                IntegerChoiceOptionData::class,
                StringValueData::class,
                BooleanValueData::class,
                IntegerValueData::class,
                DecimalValueData::class,
                StringChoiceValueData::class,
                IntegerChoiceValueData::class,
                InvalidValueData::class,
                SettingsOutcome::class,
                SettingReference::class,
                GroupReference::class,
                SettingsChange::class,
                RuntimeStatus::class,
                EnrolledHost::class,
                OpenedRuntime::class,
                AutoAssignmentChange::class,
                AutoAssignmentInput::class,
                AutoAssignmentKey::class,
                DriverType::class,
                DriverReceipt::class,
                ClaimedRequests::class,
                ClaimedRequest::class,
                RuntimeActivity::class,
                HoldReason::class,
                RequestProgress::class,
                RequestOutcome::class,
                ExpectedTiming::class,
                DriverOperation::class,
                RuntimeSetting::class,
                ScriptProgress::class,
                ScriptParameter::class,
                DriverRequestStatus::class,
                DisabledSettingsGroup::class,
                SavedSharePreview::class,
                ShareSummary::class,
                ShareFact::class,
                ShareProposalStatus::class,
                ShareState::class,
                ProfileKey::class,
                ProfileType::class,
                ProfileSnapshot::class,
                ProfileLaunchPolicy::class,
                ProfileAuthorization::class,
                AbilityGrant::class,
                AuthorizationType::class,
                ProfileProvenance::class,
                ProfileSelection::class,
                ProfileProposal::class,
                ProposedProfile::class,
                PolicyOverride::class,
                TypeOverride::class,
                ClassRule::class,
                OperationRule::class,
                ProfileChangeType::class,
                FieldOrigin::class,
                PolicyOriginType::class,
                ProfileDefinition::class,
                ProfileActivation::class,
                ActivatedProfile::class,
                SkillKey::class,
                ProgramKey::class,
                SkillOwner::class,
                SkillOrigin::class,
                MarkdownParts::class,
                MainAgent::class,
                Profiles::class,
                AgentTypes::class,
                Programs::class,
                Providers::class,
                Environments::class,
                Named::class,
                AllOf::class,
                AnyOf::class,
                Not::class,
                ProviderKey::class,
                SkillSection::class,
                MarkdownPart::class,
                SkillContext::class,
                LaunchProfile::class,
                ConditionResult::class,
                ConditionOutcome::class,
                SkillConditionRegistration::class,
                SkillEntry::class,
                RenderedSkill::class,
                SkillDraft::class,
                SectionDraft::class,
                SkillRevisionResult::class,
                Conditions::class,
                Everyone::class,
            )
            ->commands(
                ActivateProfiles::class,
                RevokeProfiles::class,
                LaunchProfileMain::class,
                CreateSkill::class,
                ReviseSkill::class,
                RestoreSkill::class,
                RetireSkill::class,
                CopySkill::class,
                PostComment::class,
                PostTextComment::class,
                SendMessage::class,
                RequireMessageAnswer::class,
                AnswerMessage::class,
                DismissMessage::class,
                RetireAgent::class,
                LaunchAgent::class,
                CreateAgent::class,
                RecordHeartbeat::class,
                RecordUserHeartbeat::class,
                EnrollHost::class,
                OpenAgentRuntime::class,
                DeliverAgent::class,
                RunKeyScript::class,
                WakeAgent::class,
                ChangeAgentModel::class,
                ChangeAgentEffort::class,
                InterruptAgent::class,
                StopAgent::class,
                ClaimDriverRequests::class,
                ReportRuntimeActivity::class,
                ReportRequestProgress::class,
                ReportDriverTurn::class,
                ReportRuntimeHeartbeat::class,
                ReportRuntimeExit::class,
                OpenHostMainRuntime::class,
                MarkSilentSessions::class,
                SettleFrameTimes::class,
                SaveSharePreview::class,
                CreateShare::class,
                RequestShare::class,
                ApproveShareRequest::class,
                RevokeShare::class,
                RevokeCommandPermissions::class,
                IssueEvidencePermit::class,
                OpenCommandRequest::class,
                WithdrawCommandRequest::class,
                RefreshShareScope::class,
                RetryShare::class,
                ConfigureShareGateway::class,
                DisableShareGateway::class,
                InstallNumbers::class,
                LinkRecords::class,
                UnlinkRecords::class,
                AssignRecord::class,
                EnableAutoAssignment::class,
                ConfigureAutoAssignment::class,
                DisableAutoAssignment::class,
                ReassignRecord::class,
                UnassignRecord::class,
                SetStringSetting::class,
                SetBooleanSetting::class,
                SetIntegerSetting::class,
                SetDecimalSetting::class,
                SetStringChoice::class,
                SetIntegerChoice::class,
                ResetSetting::class,
                EnableSettingGroup::class,
                DisableSettingGroup::class,
                ResetSettingGroup::class,
            )
            ->exceptions(
                AutoAssignmentSizeInvalid::class,
                SkillSourceInvalid::class,
                EngineActorRequired::class,
                ActiveActorCounterRepeated::class,
                MonotonicClockWentBack::class,
                ShareBudgetExceeded::class,
                SettingUnavailable::class,
                SettingDisabled::class,
                GroupSnapshotRequired::class,
                SettingValueInvalid::class,
                SettingStorageInvalid::class,
                SettingsDocumentInvalid::class,
                SettingsConflict::class,
                SettingsAccessDenied::class,
                SettingsUnavailable::class,
                SettingReferenceInvalid::class,
                SettingsOwnerUnknown::class,
                DomainDisabled::class,
                ContentMissing::class,
                ContentTooLarge::class,
                MarkdownInvalid::class,
                SectionMissing::class,
                TextMatchInvalid::class,
                AnchorMismatch::class,
                InvalidTextRange::class,
                TextVersionUnavailable::class,
                IncompleteTextAnchor::class,
                TextLineTooLong::class,
                TextSelectionRefused::class,
                TargetNotCommentable::class,
                TargetHasNoText::class,
                SubmissionKeyConflict::class,
                CommentUnavailable::class,
                ActorUnavailable::class,
                ActorProviderRepeated::class,
                SystemActorRequired::class,
                ActorCannotSend::class,
                MessageBodyEmpty::class,
                MessageMissing::class,
                SettingDeclarationInvalid::class,
                SettingHandleUnknown::class,
                DecimalInvalid::class,
                CommandTransactionMissing::class,
                AgentContextMissing::class,
                ReadPolicyMissing::class,
                QueryInValueRead::class,
                LazyLoadRefused::class,
                StateReferencesInvalid::class,
                StateTypeMissing::class,
                ReadLimitInvalid::class,
                ReadLimitTooLarge::class,
                ReadReasonMissing::class,
                ModelReadAllRefused::class,
                ReadShapeUnsupported::class,
                ReadLimitExceeded::class,
                RelationReadUndeclared::class,
                ActorContextMissing::class,
                UserActorRequired::class,
                CrossOwnerReadRefused::class,
                ActorNotAllowed::class,
                AbilityNotRegistered::class,
                ConsoleOwnerMissing::class,
                PolicyRegistrationConflict::class,
                AuthorizerProviderRepeated::class,
                StateTypeRepeated::class,
                StateTypesFrozen::class,
                UnknownLinkType::class,
                StateSubjectMissing::class,
                StackTargetRefused::class,
                StackLockTimedOut::class,
                StackTransactionRequired::class,
                InvalidAssignmentIdentity::class,
                InvalidRecordIdentity::class,
                SharingNotAllowed::class,
                InvalidAssignmentPage::class,
                InvalidRecordIds::class,
                AssignmentPoolUnavailable::class,
                AssignmentPoolTooLarge::class,
                AssignmentGroupTooLarge::class,
                AssigneeUnavailable::class,
                RecordUnavailable::class,
                AssignmentRootFinished::class,
                InvalidActorText::class,
                AgentRequestFailed::class,
                AgentNotAvailable::class,
                AgentRetirementDenied::class,
                InvalidRecordReference::class,
                MalformedExports::class,
                AgentActorRequired::class,
                AssignmentDenied::class,
                AssignmentConflict::class,
                AssignmentRetryExhausted::class,
                AssignmentTransactionRequired::class,
                AssignmentTypeUnavailable::class,
                AssignmentProviderInvalid::class,
                AssigneeTypeRepeated::class,
                AssignmentTypeRepeated::class,
                CommandDeclarationInvalid::class,
                CommandHandlerMissing::class,
                CommandHandlerTwice::class,
                CommandListedTwice::class,
                CommandNestingTooDeep::class,
                CommandNotRegistered::class,
                CommandRefused::class,
                CommandReplacedWithOtherClass::class,
                CommandReplacementRefused::class,
                CommandResultChanged::class,
                CommandRetryExhausted::class,
                CommandTransactionMismatch::class,
                ContinuationCalledTwice::class,
                ExplicitTransactionInCommand::class,
                HandlerInOtherOwner::class,
                HandlerServesTwoCommands::class,
                MiddlewareDeclarationInvalid::class,
                MiddlewareListedTwice::class,
                MiddlewareSkippedCommand::class,
                MiddlewareSwallowedFailure::class,
                NestedCommandFailureIgnored::class,
                OperationUnavailable::class,
                SharePreviewRefused::class,
                CommandRuleInvalid::class,
                CommandRuleConflict::class,
                ShellNodeMissing::class,
                VerificationContractInvalid::class,
                ResourceMimeTypeRefused::class,
                AccountContainerUnsupported::class,
                HostCapabilityUnsupported::class,
                ModelRequired::class,
                ModelUnavailable::class,
                DefaultUnavailable::class,
                ProgramRequired::class,
                ProgramConflict::class,
                ProgramUnsupported::class,
                LaunchRequestConflict::class,
                AgentBusy::class,
                AgentNameRequired::class,
                LaunchRecordMissing::class,
                ConversationIncompatible::class,
                ManifestRefused::class,
                ContainerUnavailable::class,
                ImageUnverified::class,
                CapacityUnavailable::class,
                UnknownAccessType::class,
                UnknownResourceArea::class,
                AccessPolicyInvalid::class,
                StopConditionsInvalid::class,
                ExecutionPolicyInvalid::class,
                ExecutionBudgetInvalid::class,
                ToolArgumentInvalid::class,
                ToolArgumentUnknown::class,
                ContinuationInvalid::class,
                ContinuationStale::class,
                ProfileKeyInvalid::class,
                ProfileMissing::class,
                ProfileRetired::class,
                ProfileRevisionUnreadable::class,
                ProfileFieldUnknown::class,
                ProfileProposalRefused::class,
                ProfilePolicyRefused::class,
                ProfileTypeConflict::class,
                SkillDeclarationInvalid::class,
                SkillKeyInvalid::class,
                ProgramKeyInvalid::class,
                ProviderKeyInvalid::class,
                SkillConditionInvalid::class,
                SkillRevisionConflict::class,
                SkillRequestReused::class,
                SkillRetired::class,
                SkillKeyTaken::class,
                ShippedSkillReadOnly::class,
                SkillOwnerRequired::class,
            )
            ->support(
                BelongsToOneActor::class,
                HasComments::class,
                BoundedReads::class,
                ReadBuilder::class,
                CountsLoads::class,
                CountsPivotLoads::class,
                AgentState::class,
                BelongsToOneAgent::class,
                Linkable::class,
                LinkAccess::class,
                LinkTypeRegistry::class,
                StateReferenceFactory::class,
                ProvidesModelRecords::class,
                HasNumber::class,
                AssignableListing::class,
                TextSearch::class,
                ReadsRouteNumber::class,
                JournalTool::class,
                JournalReadTool::class,
                JournalResource::class,
                RendersRefusal::class,
                SendsSignedCalls::class,
                SendsSignedWrites::class,
            )
            ->build();
    }

    /**
     * The Listeners folder of each Core area that has one, for the checked listener provider to discover.
     *
     * @return list<string>
     */
    public static function listenerFolders(): array
    {
        return glob(__DIR__.'/*/Listeners', GLOB_ONLYDIR) ?: [];
    }
}
