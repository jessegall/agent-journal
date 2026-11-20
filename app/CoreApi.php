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
use App\Actors\Contracts\ActorProvisioning;
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
use App\Actors\Contracts\MessageRecipient;
use App\Actors\Contracts\MessageSender;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\PolicyProvider;
use App\Actors\Contracts\ReplyInboxes;
use App\Actors\Contracts\SeatedActor;
use App\Actors\Contracts\TargetAuthorizer;
use App\Actors\Contracts\UserPresences;
use App\Actors\Contracts\WorkStackProvider;
use App\Actors\Contracts\WorkStacks;
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
use App\Actors\Support\CurrentUser;
use App\Actors\Support\UnrestrictedAuthorizer;
use App\Actors\Values\AbilityRequirement;
use App\Actors\Values\OwnerAuthority;
use App\Actors\Values\PolicyRegistration;
use App\Actors\Values\TrustedEntryAuthority;
use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Attributes\PresentList;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Contracts\CallRefusal;
use App\AgentRequests\Contracts\CallRegistrar;
use App\AgentRequests\Contracts\CallSender;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Enums\ReportLineType;
use App\AgentRequests\Exceptions\AnswerUnreadable;
use App\AgentRequests\Exceptions\CallCancelled;
use App\AgentRequests\Exceptions\CallConflict;
use App\AgentRequests\Exceptions\CallFailed;
use App\AgentRequests\Exceptions\CallKeyConflict;
use App\AgentRequests\Exceptions\CallKeyExpired;
use App\AgentRequests\Exceptions\CallKeyInvalid;
use App\AgentRequests\Exceptions\CallRefused;
use App\AgentRequests\Exceptions\CallTooLarge;
use App\AgentRequests\Exceptions\ClientOutOfDate;
use App\AgentRequests\Exceptions\CommandStopped;
use App\AgentRequests\Exceptions\DeadlineExpired;
use App\AgentRequests\Exceptions\EndpointDeclarationInvalid;
use App\AgentRequests\Exceptions\InputRefused;
use App\AgentRequests\Exceptions\JournalBusy;
use App\AgentRequests\Exceptions\JournalUnavailable;
use App\AgentRequests\Exceptions\NotAllowed;
use App\AgentRequests\Exceptions\NotAuthenticated;
use App\AgentRequests\Exceptions\OutcomeUnknown;
use App\AgentRequests\Exceptions\ProfilesUnavailable;
use App\AgentRequests\Exceptions\RecordNotFound;
use App\AgentRequests\Exceptions\StaleContinuation;
use App\AgentRequests\Exceptions\StateBlocked;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\AgentRequests\Values\CallAccepted;
use App\AgentRequests\Values\CallAnswer;
use App\AgentRequests\Values\CallToSend;
use App\AgentRequests\Values\CommandReport;
use App\AgentRequests\Values\ReportLine;
use App\Agents\Commands\AbandonNavigation;
use App\Agents\Commands\AnswerNavigation;
use App\Agents\Commands\CancelAccountUses;
use App\Agents\Commands\CancelDriverRequest;
use App\Agents\Commands\CancelKeyScript;
use App\Agents\Commands\CancelLaunch;
use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Commands\CloseTerminalView;
use App\Agents\Commands\ContinueStart;
use App\Agents\Commands\CreateAgent;
use App\Agents\Commands\DeliverAgent;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\HoldAccountUses;
use App\Agents\Commands\ImportHelperCommits;
use App\Agents\Commands\InterruptAgent;
use App\Agents\Commands\InterruptNavigation;
use App\Agents\Commands\MarkMenuEntryStale;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Commands\OpenTerminalView;
use App\Agents\Commands\ProveNavigation;
use App\Agents\Commands\RaiseNavigation;
use App\Agents\Commands\ReassignAgentRuntime;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\RecordRuntime;
use App\Agents\Commands\ReleaseAgentHold;
use App\Agents\Commands\RenewTerminalView;
use App\Agents\Commands\RepairDriverSettings;
use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Commands\ReportEntryReplayed;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Commands\ReportRuntimeScreen;
use App\Agents\Commands\ResolveDriverDelivery;
use App\Agents\Commands\ResumeKeyScript;
use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\RetireMenuEntry;
use App\Agents\Commands\RetryDriverRequest;
use App\Agents\Commands\RunKeyScript;
use App\Agents\Commands\SettleAccountUses;
use App\Agents\Commands\StartAgent;
use App\Agents\Commands\StartOwnedAgent;
use App\Agents\Commands\StopAgent;
use App\Agents\Commands\WakeAgent;
use App\Agents\Contracts\AccountUses;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Contracts\CallingProgram;
use App\Agents\Contracts\ConversationVisits;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\LaunchCandidates;
use App\Agents\Contracts\NativeTurnRecords;
use App\Agents\Contracts\ProgramConversationResolver;
use App\Agents\Contracts\ReadGrant;
use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Contracts\SessionProvenance;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Contracts\StartExecutor;
use App\Agents\Contracts\StartReceipts;
use App\Agents\Contracts\StartRecordResolver;
use App\Agents\Contracts\StartReservations;
use App\Agents\Contracts\ToolDiscovery;
use App\Agents\Data\DriverRequestStatus;
use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\LaunchCandidateRank;
use App\Agents\Enums\MenuEntryState;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Enums\NavigationKey;
use App\Agents\Enums\NavigationReason;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Enums\ProgramFailure;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\ReservationState;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Enums\ScreenReportRefusal;
use App\Agents\Enums\StartDisposition;
use App\Agents\Enums\StartOriginType;
use App\Agents\Enums\StartRefusalType;
use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Events\AgentHoldReleased;
use App\Agents\Events\AgentRuntimeReassigned;
use App\Agents\Events\DriverRequestRecovered;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Events\LaunchEnded;
use App\Agents\Events\ProgramFailed;
use App\Agents\Events\SessionClosed;
use App\Agents\Events\StartAccepted;
use App\Agents\Events\StartUnavailable;
use App\Agents\Exceptions\AccessPolicyInvalid;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\AccountInUse;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Exceptions\AccountUseMissing;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\AgentContextMissing;
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
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Exceptions\MenuStepRefused;
use App\Agents\Exceptions\ModelRequired;
use App\Agents\Exceptions\ModelUnavailable;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Exceptions\OfflineReplyModeInvalid;
use App\Agents\Exceptions\ProgramConflict;
use App\Agents\Exceptions\ProgramRequired;
use App\Agents\Exceptions\ProgramUnsupported;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Exceptions\StartRequestConflict;
use App\Agents\Exceptions\StopConditionsInvalid;
use App\Agents\Support\AccountUse;
use App\Agents\Support\AccountUseCounts;
use App\Agents\Support\AgentLabel;
use App\Agents\Support\ClaimedRequest;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\ContainerManifest;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\EntryGoalAnswer;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Support\ExecutionReceipt;
use App\Agents\Support\ExecutionReference;
use App\Agents\Support\ExitReceipt;
use App\Agents\Support\HeldAccountUses;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\LaunchCandidateFacts;
use App\Agents\Support\LaunchCandidateQuery;
use App\Agents\Support\LaunchProfileKey;
use App\Agents\Support\LibraryEntryAnswer;
use App\Agents\Support\ManifestMount;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Support\OwnerStartReceipt;
use App\Agents\Support\OwnerStartRequest;
use App\Agents\Support\PreparedStart;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\ProgramConversationSummary;
use App\Agents\Support\RankedLaunchCandidate;
use App\Agents\Support\ScreenReportAnswer;
use App\Agents\Support\SelectedAccount;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\SelectionSource;
use App\Agents\Support\SessionOption;
use App\Agents\Support\StackTarget;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartReceipt;
use App\Agents\Support\StartRecordDetails;
use App\Agents\Support\StartRequest;
use App\Agents\Support\TerminalViewReceipt;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\HelperImportReceipt;
use App\Agents\Values\MenuStep;
use App\Agents\Values\NavigationAnswer;
use App\Agents\Values\NavigationRound;
use App\Agents\Values\NavigationRoundReport;
use App\Agents\Values\NavigationScreen;
use App\Agents\Values\NavigationUncertainty;
use App\Agents\Values\Operation as PolicyOperation;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\ReadRequest;
use App\Agents\Values\ResourceRequest;
use App\Agents\Values\ScriptGoal;
use App\Agents\Values\ScriptParameter;
use App\Agents\Values\ScriptProgress;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Agents\Values\WorkReference;
use App\Agents\Values\WorkspaceReadReference;
use App\Assignments\Calls\Concerns\NamesExpectedAssignment;
use App\Assignments\Calls\Concerns\NamesRecipient;
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
use App\Assignments\Contracts\AssignmentDestinationResolver;
use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AssignmentPoolFactory;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\AutoAssigner;
use App\Assignments\Contracts\AutoAssignmentActivity;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Enums\AssignmentPurpose;
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
use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeIdentity;
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
use App\Assignments\Support\AssignmentRequest;
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
use App\Autoload\Support\FolderClasses;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\OneLine;
use App\Bus\Attributes\Operation as CommandOperationDeclaration;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Contracts\ClassLevelAbilities;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\CommandMiddlewareProvider;
use App\Bus\Contracts\CommandProvider;
use App\Bus\Contracts\CommandTransaction;
use App\Bus\Contracts\OperationResolver;
use App\Bus\Contracts\RefusalDetails;
use App\Bus\Contracts\RequestKey;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Enums\CommandScopeType;
use App\Bus\Enums\MiddlewareStage;
use App\Bus\Enums\ReceiptState;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandHandlerTwice;
use App\Bus\Exceptions\CommandInputInvalid;
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
use App\Bus\Support\Command as BaseCommand;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\Operation;
use App\Bus\Values\RecoveryCall;
use App\Comments\Calls\ListCommentsCall;
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
use App\Communication\Commands\AskMessage;
use App\Communication\Commands\AskQuestion;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\ReadMessages;
use App\Communication\Commands\ReleaseMessageClaim;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SelectMessage;
use App\Communication\Commands\SendMessage;
use App\Communication\Commands\TakeNextMessages;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxAccess;
use App\Communication\Contracts\InboxDestinationResolver;
use App\Communication\Contracts\InboxNotices;
use App\Communication\Contracts\InboxProvider;
use App\Communication\Contracts\InboxRegistration;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Contracts\MessageCommand;
use App\Communication\Data\AgentInbox;
use App\Communication\Data\AgentInboxCounts;
use App\Communication\Data\AgentMessageCard;
use App\Communication\Data\AgentMessageDetails;
use App\Communication\Data\InboxCounts;
use App\Communication\Data\InboxView;
use App\Communication\Data\MessageClaimHolder;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Data\MessageReader;
use App\Communication\Data\MessageReadResult;
use App\Communication\Data\MessageView;
use App\Communication\Data\WakeStatus;
use App\Communication\Enums\AgentInboxState;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\MessageState;
use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageSent;
use App\Communication\Events\MessageTakenUp;
use App\Communication\Exceptions\ActorCannotSend;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Exceptions\InboxProviderInvalid;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Exceptions\MessageBodyTooLong;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Exceptions\MessageToSelf;
use App\Communication\Support\InboxMembers;
use App\Communication\Support\InboxMembership;
use App\Contracts\CommandHandler;
use App\Contracts\CommandRefusal;
use App\Contracts\DomainAvailability;
use App\Contracts\Event;
use App\Contracts\Listener;
use App\Contracts\ListenerFailureLog;
use App\Desks\Commands\CreateDesk;
use App\Desks\Commands\InstallDesks;
use App\Desks\Commands\ProvisionActorDesk;
use App\Desks\Commands\ReleaseSeat;
use App\Desks\Commands\ReplaceSeatOccupant;
use App\Desks\Commands\RestoreActorDesk;
use App\Desks\Commands\SeatActor;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Contracts\Desk;
use App\Desks\Contracts\RunClaims;
use App\Desks\Exceptions\DeskSeatCountInvalid;
use App\Desks\Exceptions\DeskUnavailable;
use App\Desks\Exceptions\RunClaimRefused;
use App\Desks\Exceptions\SeatCapacityReached;
use App\Desks\Exceptions\SeatConflict;
use App\Desks\Exceptions\SecondForwardingSeat;
use App\Desks\Support\SeatChangeResult;
use App\Domains\Contracts\IncomingWorkProvider;
use App\Domains\Contracts\InternalAssignableContributor;
use App\Engine\Commands\EndTerminalViews;
use App\Engine\Commands\EnforceLaunchLimits;
use App\Engine\Commands\ExpireNavigationRequests;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Commands\SettleFrameTimes;
use App\Engine\Events\EngineTicked;
use App\Engine\Values\FrameSettlement;
use App\Exports\Exceptions\MalformedExports;
use App\Exports\Support\ExportBuilder;
use App\Exports\Support\Exports;
use App\Hooks\Attributes\StackWide;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\Answer;
use App\Hooks\Contracts\ConditionalState;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\IncomingWork;
use App\Hooks\Contracts\IncomingWorkRegistration;
use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Contracts\ReminderContribution;
use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\StackTransition;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\StateRegistration;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Contracts\WorkProgress;
use App\Hooks\Contracts\WorkRecordState;
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
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\IncomingWorkRepeated;
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
use App\Hooks\Inputs\ProgramToolInput;
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
use App\Hooks\Inputs\ToolRequested;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\Stack\StackVerdict;
use App\Hooks\States\AgentState;
use App\Hooks\Ticks\ElapsedTime;
use App\Hooks\Values\EventCommands;
use App\Hooks\Values\StopAttemptReference;
use App\Http\Data\Assignments\RecordHolderData;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Links\Events\LinksRemoved;
use App\Links\Exceptions\UnknownLinkType;
use App\Links\Support\Linkable;
use App\Links\Support\LinkAccess;
use App\Links\Support\LinkTypeRegistry;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Contracts\McpToolProvider;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use App\Mcp\Data\ToolResult as McpToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Exceptions\ResourceMimeTypeRefused;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\TextChunk;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\Concerns\ReadsAssignmentArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\JournalWriteTool;
use App\Numbers\Commands\InstallNumbers;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Contracts\NumberedModelProvider;
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
use App\Processes\Contracts\CommandRuleProvider;
use App\Processes\Contracts\FactOrigin;
use App\Processes\Contracts\ProgramClassifier;
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
use App\Processes\Values\CommandPatternSet;
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
use App\Processes\Values\ProcessGrants;
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
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\DismissAccountNotice;
use App\Profiles\Commands\MaintainAccount;
use App\Profiles\Commands\RemoveAccount;
use App\Profiles\Commands\RenameAccount;
use App\Profiles\Commands\RetryAccountCleanup;
use App\Profiles\Commands\RetryAttemptCleanup;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Commands\StartProfileMain;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Enums\CommandDirectory;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileChangeType;
use App\Profiles\Enums\SupervisorCoverageType;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Exceptions\AbilityNotWithheld;
use App\Profiles\Exceptions\AccountLabelInvalid;
use App\Profiles\Exceptions\AccountLabelTaken;
use App\Profiles\Exceptions\AccountMissing;
use App\Profiles\Exceptions\BuiltInProfileMissing;
use App\Profiles\Exceptions\ProfileCannotCoordinate;
use App\Profiles\Exceptions\ProfileFieldUnknown;
use App\Profiles\Exceptions\ProfileKeyInvalid;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Exceptions\ProfileRevisionUnreadable;
use App\Profiles\Exceptions\SignInAttemptMissing;
use App\Profiles\Exceptions\SignInAttemptStale;
use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Support\BaseOverride;
use App\Profiles\Support\ClassRule;
use App\Profiles\Support\OperationRule;
use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ActivatedProfile;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\DraftExpectations;
use App\Profiles\Values\ExpectedDraftRevision;
use App\Profiles\Values\FieldOrigin;
use App\Profiles\Values\NamedCommand;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileAuthorization;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileProvenance;
use App\Profiles\Values\ProfileRevisionReference;
use App\Profiles\Values\ProfileSelection;
use App\Profiles\Values\ProfileSnapshot;
use App\Profiles\Values\ProfileStartPolicy;
use App\Profiles\Values\ScriptDiff;
use App\Profiles\Values\ScriptSource;
use App\Profiles\Values\SignInStarted;
use App\Profiles\Values\StartProfileAuthority;
use App\Profiles\Values\SupervisorCoverage;
use App\Profiles\Values\SupervisorOverride;
use App\Profiles\Values\SupervisorProfile;
use App\Profiles\Values\SupervisorRoutes;
use App\Profiles\Values\SupervisorTarget;
use App\Profiles\Values\WithheldAbility;
use App\Programs\Enums\HookProgram;
use App\Programs\Exceptions\ProgramKeyInvalid;
use App\Programs\Exceptions\ProviderKeyInvalid;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;
use App\Queries\Support\TextSearch;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Contracts\ReadMeter;
use App\Reads\Enums\ReadMode;
use App\Reads\Enums\ReadView;
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
use App\Records\Contracts\IdentityLinks;
use App\Records\Contracts\RecordLinker;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordResolver;
use App\Records\Data\RecordCard;
use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\ProvidesModelRecords;
use App\Records\Support\RecordIdentity;
use App\Scripts\Attributes\ScriptMember;
use App\Scripts\Attributes\ScriptObject;
use App\Scripts\Contracts\ScriptKeywordDefinition;
use App\Scripts\Values\ScriptContext;
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
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Contracts\SettingsProvider;
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
use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareBudget;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Contracts\ShareGatewayProvider;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Contracts\ShareRecordContributor;
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
use App\Skills\Conditions\Abilities;
use App\Skills\Conditions\AllOf;
use App\Skills\Conditions\AnyOf;
use App\Skills\Conditions\Conditions;
use App\Skills\Conditions\Environments;
use App\Skills\Conditions\Everyone;
use App\Skills\Conditions\Named;
use App\Skills\Conditions\Not;
use App\Skills\Conditions\ProfileBases;
use App\Skills\Conditions\Profiles;
use App\Skills\Conditions\Programs;
use App\Skills\Conditions\Providers;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Contracts\SkillConditionEvaluator;
use App\Skills\Contracts\SkillConditionProvider;
use App\Skills\Contracts\SkillProvider;
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
use App\Skills\Values\SkillSections;
use App\Skills\Values\StartProfile;
use App\Supervision\Commands\AdvanceAsk;
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
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageOption;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Contracts\UserInterfaceUpdater;
use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\ChoiceOption;
use App\Ui\Declarations\FloatSize;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page as UiPage;
use App\Ui\Declarations\PaneChoice;
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
                MessageRead::class,
                MessageTakenUp::class,
                MessageAnswerRequired::class,
                MessageClaimReleased::class,
                ContextStarted::class,
                HelperCompletionCertified::class,
                HelperStopHeld::class,
                StateTypesRequested::class,
                AssignmentsChanged::class,
                SessionClosed::class,
                DriverRequestRecovered::class,
                AgentHoldReleased::class,
                AgentRuntimeReassigned::class,
                ProfileRevisionRevoked::class,
                StartAccepted::class,
                StartUnavailable::class,
                LaunchCancelled::class,
                LaunchEnded::class,
                ProgramFailed::class,
                AccountUseChanged::class,
                AccountsChanged::class,
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
                JobPermissionReader::class,
                TextFields::class,
                Continuations::class,
                RequestKey::class,
                ReadGrant::class,
                SessionPolicyReader::class,
                LaunchCandidates::class,
                StartReservations::class,
                StartReceipts::class,
                CallingProgram::class,
                ResponsibilityWriter::class,
                ActiveAccountReader::class,
                AgentStartCommand::class,
                AccountUses::class,
                IdentityLinks::class,
                JournalCall::class,
                CallRegistrar::class,
                CallSender::class,
                CallRefusal::class,
                RecordProvider::class,
                RecordResolver::class,
                RecordLinker::class,
                CommandTransaction::class,
                SessionProvenance::class,
                InboxNotices::class,
                CurrentSession::class,
                SearchContribution::class,
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
                ToolDiscovery::class,
                StartExecutor::class,
                HostCapabilities::class,
                StartRecordResolver::class,
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
                MessageSender::class,
                MessageRecipient::class,
                ActorResolver::class,
                ActorProvider::class,
                ActorProviderRegistration::class,
                ActorLabels::class,
                Policy::class,
                PolicyCatalogue::class,
                ActorWorkStacks::class,
                WorkRecordState::class,
                WorkProgress::class,
                ScriptKeywordDefinition::class,
                Inbox::class,
                InboxResolver::class,
                InboxRegistration::class,
                InboxProvider::class,
                InboxAccess::class,
                ActorDesks::class,
                ActorProvisioning::class,
                RunClaims::class,
                ReplyInboxes::class,
                InternalAssignableContributor::class,
                IncomingWorkProvider::class,
                IncomingWork::class,
                ListenerFailureLog::class,
                IncomingWorkRegistration::class,
                Desk::class,
                SeatedActor::class,
                AssignmentDestinationResolver::class,
                InboxDestinationResolver::class,
                ActorInboxResolver::class,
                WorkStacks::class,
                PolicyProvider::class,
                WorkStackProvider::class,
                AuthorizedCommand::class,
                MessageCommand::class,
                ClassLevelAbilities::class,
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
                ConversationResolver::class,
                CommentResolver::class,
                ShellCommandParser::class,
                CommandClassifier::class,
                CommandRuleProvider::class,
                ProgramClassifier::class,
                FactOrigin::class,
                ResultReceipts::class,
                VerificationTiming::class,
                HookAnswerer::class,
                HookInput::class,
                OperationPolicy::class,
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
                Numbered::class,
                NumberedModelProvider::class,
                AssigneeResolver::class,
                AssignmentWriter::class,
                AssignmentTransaction::class,
                AutoAssigner::class,
                AssignmentPool::class,
                AssignmentPoolFactory::class,
                AssignedWorkResolver::class,
                AssignedWorkProvider::class,
                AssignmentQuery::class,
                AutoAssignmentProvider::class,
                CurrentUserResolver::class,
                Command::class,
                CommandBus::class,
                CommandMiddleware::class,
                CommandRefusal::class,
                Event::class,
                Listener::class,
                CommandHandler::class,
                CommandProvider::class,
                McpToolProvider::class,
                AgentMessageReader::class,
                RefusalDetails::class,
                McpCall::class,
                NumberedPages::class,
                CommandMiddlewareProvider::class,
                AdmittedRecipients::class,
                JournalAdmission::class,
                UserInterfaceUpdater::class,
                CountResolver::class,
                NavigationChildren::class,
                PageOption::class,
                PageResolver::class,
                NavigationProvider::class,
                PageProvider::class,
                SectionProvider::class,
                SectionResolver::class,
                VisibilityCheck::class,
                SettingsProvider::class,
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
                ShareRecordContributor::class,
                ShareGatewayProvider::class,
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
                SkillProvider::class,
                Skill::class,
                SkillCondition::class,
                SkillConditionProvider::class,
                SkillResolver::class,
                SkillConditionEvaluator::class,
            )
            ->values(
                SupervisorTarget::class,
                SupervisorOverride::class,
                ExpectedDraftRevision::class,
                SupervisorRoutes::class,
                SupervisorProfile::class,
                SupervisorCoverage::class,
                ScriptDiff::class,
                ProfileRevisionReference::class,
                NamedCommand::class,
                DraftExpectations::class,
                AskTypeKey::class,
                SupervisorCoverageType::class,
                CommandDirectory::class,
                StackVerdict::class,
                WorkspaceReadReference::class,
                WorkReference::class,
                HelperImportReceipt::class,
                NavigationUncertainty::class,
                EventCommands::class,
                StackWide::class,
                FolderClasses::class,
                Endpoint::class,
                CallKeyCast::class,
                CallKeyTransformer::class,
                PresentList::class,
                InPath::class,
                CallEffect::class,
                ReceiptOwner::class,
                CallKey::class,
                CommandReport::class,
                ReportLine::class,
                ReportLineType::class,
                CallToSend::class,
                CallAccepted::class,
                CallAnswer::class,
                RefusalCode::class,
                ReceiptState::class,
                Operation::class,
                McpToolResult::class,
                AgentInboxCounts::class,
                AgentInbox::class,
                AgentMessageCard::class,
                AgentMessageDetails::class,
                AgentInboxState::class,
                ReadView::class,
                NextAction::class,
                OverviewSection::class,
                ListedPage::class,
                HookProgram::class,
                PreparedStart::class,
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
                SelectedAccount::class,
                AccountUse::class,
                AccountUseCounts::class,
                HeldAccountUses::class,
                SignInStarted::class,
                AccountProcessRole::class,
                StartUnavailableReason::class,
                ProgramFailure::class,
                ModelSelection::class,
                SelectionSource::class,
                ProfileDefaults::class,
                ModelSelectionType::class,
                ProgramSourceType::class,
                StartRefusalType::class,
                StartRequest::class,
                StartReceipt::class,
                StartRecordDetails::class,
                ProgramConversationSummary::class,
                ContainerManifest::class,
                ManifestMount::class,
                HostCapacity::class,
                ReservationState::class,
                StartOriginType::class,
                ConversationModeType::class,
                StartDisposition::class,
                AccessType::class,
                ResourceAreaType::class,
                AccessRuleType::class,
                ResourceRequest::class,
                PolicyOperation::class,
                OperationGrant::class,
                ClassGrant::class,
                AccessDecision::class,
                AccessPolicy::class,
                ProcessGrants::class,
                CommandPatternSet::class,
                StopCondition::class,
                StopConditions::class,
                ExecutionBudgets::class,
                ExecutionPolicy::class,
                StartPolicy::class,
                LaunchCandidateQuery::class,
                LaunchCandidateFacts::class,
                LaunchProfileKey::class,
                RankedLaunchCandidate::class,
                LaunchCandidateRank::class,
                OwnerStartRequest::class,
                OwnerStartReceipt::class,
                ToolArguments::class,
                ReadRequest::class,
                Continuation::class,
                TextChunk::class,
                SearchHit::class,
                SearchPage::class,
                Dispatches::class,
                VisibleToProfiles::class,
                DiscoveryProfile::class,
                RecoveryCall::class,
                RecordCard::class,
                StateReferences::class,
                StateSet::class,
                ReadMode::class,
                ReadOrder::class,
                PageSize::class,
                RelationRead::class,
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
                MessageView::class,
                MessagePage::class,
                MessageReader::class,
                MessageClaimHolder::class,
                InboxCounts::class,
                InboxView::class,
                MessageReadBatch::class,
                MessageReadResult::class,
                DismissalType::class,
                WakeStatus::class,
                MessageState::class,
                CommentDetails::class,
                RecordCommentView::class,
                TextCommentView::class,
                RecordCommentLocation::class,
                TextCommentLocation::class,
                CommentList::class,
                ListCommentsCall::class,
                NoSubject::class,
                SubjectReference::class,
                ContextCompacted::class,
                CompactionDetails::class,
                ContextStartType::class,
                SessionTransferType::class,
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
                ToolRequested::class,
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
                ProgramToolInput::class,
                NavigationScreen::class,
                NavigationRaiseAnswer::class,
                LibraryEntryAnswer::class,
                EntryGoalAnswer::class,
                ScriptGoal::class,
                NavigationReason::class,
                MenuEntryState::class,
                NavigationRound::class,
                NavigationRoundReport::class,
                NavigationAnswer::class,
                MenuStep::class,
                NavigationKey::class,
                NavigationCompletion::class,
                TerminalViewReceipt::class,
                ScreenReportAnswer::class,
                ScreenReportRefusal::class,
                ToolOutcome::class,
                ActorIdentity::class,
                AbilityRequirement::class,
                PolicyRegistration::class,
                AssigneeIdentity::class,
                AssignmentRequest::class,
                AssignmentPurpose::class,
                SeatChangeResult::class,
                InboxMembership::class,
                InboxMembers::class,
                ActorLabelSet::class,
                UnrestrictedAuthorizer::class,
                StartProfileAuthority::class,
                OwnerAuthority::class,
                TrustedEntryAuthority::class,
                RecordIdentity::class,
                StopAttemptReference::class,
                AssigneeRegistration::class,
                ActivityRegistration::class,
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
                NumberedModel::class,
                RecordReference::class,
                Exports::class,
                ExportBuilder::class,
                NumberedPage::class,
                AssignmentHolders::class,
                AssignmentHolder::class,
                HandledBy::class,
                OneLine::class,
                RepeatableRead::class,
                RequiresRequestKey::class,
                RetainedActorRequestKey::class,
                ElapsedTime::class,
                FrameSettlement::class,
                MiddlewareStage::class,
                CommandScopeType::class,
                CommandScope::class,
                MiddlewareDeclaration::class,
                Authorize::class,
                Effect::class,
                CommandOperationDeclaration::class,
                CommandEffectType::class,
                CommandCall::class,
                CurrentUser::class,
                ActionRoute::class,
                ChoiceOption::class,
                FloatSize::class,
                NavigationItem::class,
                UiPage::class,
                PaneChoice::class,
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
                RecoveryAction::class,
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
                ScriptSource::class,
                ScriptContext::class,
                ScriptObject::class,
                ScriptMember::class,
                ProfileBase::class,
                OfflineReplyMode::class,
                ProfileSnapshot::class,
                ProfileStartPolicy::class,
                ProfileAuthorization::class,
                WithheldAbility::class,
                AbilityGrant::class,
                AuthorizationType::class,
                ProfileProvenance::class,
                ProfileSelection::class,
                ProfileProposal::class,
                ProposedProfile::class,
                PolicyOverride::class,
                BaseOverride::class,
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
                Abilities::class,
                Profiles::class,
                ProfileBases::class,
                Programs::class,
                Providers::class,
                Environments::class,
                Named::class,
                AllOf::class,
                AnyOf::class,
                Not::class,
                ProviderKey::class,
                SkillSection::class,
                SkillSections::class,
                MarkdownPart::class,
                SkillContext::class,
                StartProfile::class,
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
                StartProfileMain::class,
                SwitchAccount::class,
                RenameAccount::class,
                MaintainAccount::class,
                DismissAccountNotice::class,
                BeginSignIn::class,
                BeginSignInAgain::class,
                RemoveAccount::class,
                RetryAccountCleanup::class,
                RetryAttemptCleanup::class,
                CancelSignIn::class,
                SubmitSignInCode::class,
                HoldAccountUses::class,
                CancelAccountUses::class,
                SettleAccountUses::class,
                CreateSkill::class,
                ReviseSkill::class,
                RestoreSkill::class,
                RetireSkill::class,
                CopySkill::class,
                PostComment::class,
                PostTextComment::class,
                SendMessage::class,
                SelectMessage::class,
                AskQuestion::class,
                AnswerMessage::class,
                AskMessage::class,
                ReadMessages::class,
                TakeNextMessages::class,
                ReplyToMessage::class,
                ReleaseMessageClaim::class,
                RequireMessageAnswer::class,
                DismissMessage::class,
                RetireAgent::class,
                StartAgent::class,
                StartOwnedAgent::class,
                CancelLaunch::class,
                ContinueStart::class,
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
                ImportHelperCommits::class,
                RetryDriverRequest::class,
                CancelDriverRequest::class,
                ResolveDriverDelivery::class,
                RepairDriverSettings::class,
                ReleaseAgentHold::class,
                OpenTerminalView::class,
                RenewTerminalView::class,
                CloseTerminalView::class,
                AbandonNavigation::class,
                AnswerNavigation::class,
                InterruptNavigation::class,
                ProveNavigation::class,
                RaiseNavigation::class,
                MarkMenuEntryStale::class,
                ReportEntryReplayed::class,
                RetireMenuEntry::class,
                ResumeKeyScript::class,
                CancelKeyScript::class,
                ReassignAgentRuntime::class,
                RecordRuntime::class,
                ClaimDriverRequests::class,
                ReportRuntimeActivity::class,
                ReportRequestProgress::class,
                ReportDriverTurn::class,
                ReportRuntimeHeartbeat::class,
                ReportRuntimeExit::class,
                ReportRuntimeScreen::class,
                OpenHostMainRuntime::class,
                MarkSilentSessions::class,
                EndTerminalViews::class,
                EnforceLaunchLimits::class,
                AdvanceAsk::class,
                ExpireNavigationRequests::class,
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
                CreateDesk::class,
                InstallDesks::class,
                ProvisionActorDesk::class,
                RestoreActorDesk::class,
                SeatActor::class,
                ReplaceSeatOccupant::class,
                ReleaseSeat::class,
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
                EndpointDeclarationInvalid::class,
                CommandStopped::class,
                CallFailed::class,
                CallRefused::class,
                NavigationAnswerRefused::class,
                MenuStepRefused::class,
                AnswerUnreadable::class,
                InputRefused::class,
                NotAuthenticated::class,
                NotAllowed::class,
                RecordNotFound::class,
                StateBlocked::class,
                CallConflict::class,
                CallKeyConflict::class,
                CallKeyExpired::class,
                StaleContinuation::class,
                JournalBusy::class,
                JournalUnavailable::class,
                CallCancelled::class,
                ClientOutOfDate::class,
                ProfilesUnavailable::class,
                CallTooLarge::class,
                DeadlineExpired::class,
                OutcomeUnknown::class,
                CallKeyInvalid::class,
                BuiltInProfileMissing::class,
                AutoAssignmentSizeInvalid::class,
                OfflineReplyModeInvalid::class,
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
                InboxUnavailable::class,
                AnswerImpossible::class,
                MessageBodyTooLong::class,
                MessageStateConflict::class,
                MessageToSelf::class,
                IncomingWorkRepeated::class,
                DeskUnavailable::class,
                DeskSeatCountInvalid::class,
                SeatCapacityReached::class,
                SecondForwardingSeat::class,
                SeatConflict::class,
                RunClaimRefused::class,
                InboxProviderInvalid::class,
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
                AccountUnavailable::class,
                AccountUseMissing::class,
                AccountInUse::class,
                AccountMissing::class,
                AccountLabelTaken::class,
                AccountLabelInvalid::class,
                SignInAttemptMissing::class,
                SignInAttemptStale::class,
                SignInCodeInvalid::class,
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
                CommandInputInvalid::class,
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
                StartRequestConflict::class,
                AgentBusy::class,
                StartRefused::class,
                StartRecordMissing::class,
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
                AbilityNotWithheld::class,
                ProfileRetired::class,
                ProfileRevisionUnreadable::class,
                ProfileFieldUnknown::class,
                ProfileProposalRefused::class,
                ProfilePolicyRefused::class,
                ProfileCannotCoordinate::class,
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
                JournalWriteTool::class,
                ReadsAssignmentArguments::class,
                JournalResource::class,
                RendersRefusal::class,
                RunsCallPipelines::class,
                NamesRecipient::class,
                NamesExpectedAssignment::class,
                BaseCommand::class,
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
