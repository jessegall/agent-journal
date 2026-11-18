<?php

declare(strict_types=1);

namespace App;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorReader;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Contracts\UserPresences;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActiveActorCounterRepeated;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\ActorProviderRepeated;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Exceptions\AgentActorRequired;
use App\Actors\Exceptions\EngineActorRequired;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\CurrentUser;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\AgentRequests\Support\AgentReply;
use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Commands\DeliverAgent;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\InterruptAgent;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\StopAgent;
use App\Agents\Commands\WakeAgent;
use App\Agents\Contracts\AgentReader;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\LaunchExecutor;
use App\Agents\Contracts\LaunchReadiness;
use App\Agents\Contracts\RuntimeReader;
use App\Agents\Contracts\SessionReader;
use App\Agents\Data\DriverRequestStatus;
use App\Agents\Data\RuntimeSetting;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Events\LaunchEnded;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Exceptions\DefaultUnavailable;
use App\Agents\Exceptions\ModelRequired;
use App\Agents\Exceptions\ModelUnavailable;
use App\Agents\Exceptions\ProgramConflict;
use App\Agents\Exceptions\ProgramRequired;
use App\Agents\Exceptions\ProgramUnsupported;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\AgentLabel;
use App\Agents\Support\ClaimedRequest;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\ExecutionReceipt;
use App\Agents\Support\ExecutionReference;
use App\Agents\Support\ExitReceipt;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Support\PreparedLaunch;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\SelectionSource;
use App\Agents\Support\SessionOption;
use App\Agents\Support\StackTarget;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Events\AssignmentsChanged;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Exceptions\InvalidAssignmentIdentity;
use App\Assignments\Exceptions\InvalidAssignmentPage;
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
use App\Assignments\Support\NumberedPage;
use App\Assignments\Support\Page;
use App\Assignments\Support\RecordIds;
use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\OperationReader;
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
use App\Comments\Contracts\CommentReader;
use App\Comments\Contracts\PublicCommentReader;
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
use App\Communication\Contracts\ConversationReader;
use App\Communication\Contracts\MessageAddressReader;
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
use App\Hooks\Contracts\StackCleanup;
use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\StackTransition;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\StateRegistration;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\HookProgram;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SessionEndReason;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Events\ContextWasCompacted;
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
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\CommandEffect;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\CommandPart;
use App\Processes\Values\ShellCommand;
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
use App\Records\Contracts\RecordReader;
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
use App\Settings\Contracts\ChoiceLabel;
use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\ProvidesSettings;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingCommands;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Contracts\SettingsReader;
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
use App\Settings\Support\CurrentSettingsReader;
use App\Settings\Support\DisabledSettingsGroup;
use App\Settings\Values\Choice;
use App\Settings\Values\Decimal;
use App\Settings\Values\GroupReference;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareBudget;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Contracts\ShareStatusReader;
use App\Sharing\Enums\ShareRelationType;
use App\Sharing\Exceptions\ShareBudgetExceeded;
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
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecordRegistration;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelation;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareRelationSet;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;
use App\Text\Contracts\TextContent;
use App\Text\Contracts\TextReader;
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
use App\Ui\Contracts\CountReader;
use App\Ui\Contracts\NavigationChildren;
use App\Ui\Contracts\PageOption;
use App\Ui\Contracts\PageReader;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
use App\Ui\Contracts\SectionReader;
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
use App\Web\Contracts\CurrentUserReader;

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
            ->events(LinksRemoved::class, CommentPosted::class, MessageSent::class, MessageAnswered::class, MessageDismissed::class, ContextWasCompacted::class, StateTypesRequested::class, AssignmentsChanged::class, LaunchEnded::class, EngineTicked::class, SettingsChanged::class)
            ->contracts(
                RecordProvider::class,
                RecordReader::class,
                RecordLinker::class,
                CurrentSession::class,
                ReadableModel::class,
                ReadMeter::class,
                Actor::class,
                CurrentActor::class,
                CurrentActorSetter::class,
                AgentReader::class,
                SessionReader::class,
                LaunchReadiness::class,
                LaunchExecutor::class,
                HostCapabilities::class,
                RuntimeReader::class,
                AgentStack::class,
                UserStack::class,
                StackTransactionRunner::class,
                StateLoader::class,
                Answer::class,
                StackTransition::class,
                StackEditor::class,
                StackCleanup::class,
                CurrentState::class,
                WorkedOnStack::class,
                TextContent::class,
                TextReader::class,
                Commentable::class,
                SendsMessages::class,
                ReceivesMessages::class,
                ActorReader::class,
                ActorProvider::class,
                ActorProviderRegistration::class,
                ActiveActorRegistration::class,
                ActiveActorCounter::class,
                UserPresences::class,
                MessageAddressReader::class,
                ConversationReader::class,
                CommentReader::class,
                ShellCommandParser::class,
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
                AssignmentReader::class,
                AssignmentRegistration::class,
                AgentRequestSender::class,
                Numbered::class,
                ProvidesNumberedModels::class,
                AssigneeReader::class,
                AssignmentWriter::class,
                AssignmentTransaction::class,
                CurrentUserReader::class,
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
                JournalAccessPolicy::class,
                UpdatesUserInterface::class,
                CountReader::class,
                NavigationChildren::class,
                PageOption::class,
                PageReader::class,
                ProvidesNavigation::class,
                ProvidesPages::class,
                ProvidesSections::class,
                SectionReader::class,
                VisibilityCheck::class,
                ProvidesSettings::class,
                Setting::class,
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
                ShareStatusReader::class,
                PublicCommentReader::class,
                SettingsReader::class,
                SettingCommands::class,
                SettingsSnapshot::class,
                EnabledSettingsGroup::class,
                SettingsCatalogue::class,
                SettingsAccessPolicy::class,
                CodedRefusal::class,
                OperationReader::class,
                OverviewContribution::class,
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
                SelectedProgram::class,
                ModelSelection::class,
                SelectionSource::class,
                ProfileDefaults::class,
                ModelSelectionType::class,
                ProgramSourceType::class,
                LaunchRefusalType::class,
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
                AllowsEngine::class,
                ElapsedTime::class,
                FrameSettlement::class,
                MiddlewareStage::class,
                CommandScopeType::class,
                CommandScope::class,
                MiddlewareDeclaration::class,
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
                CurrentSettingsReader::class,
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
                DriverRequestStatus::class,
                DisabledSettingsGroup::class,
                SavedSharePreview::class,
            )
            ->commands(
                PostComment::class,
                PostTextComment::class,
                SendMessage::class,
                RequireMessageAnswer::class,
                AnswerMessage::class,
                DismissMessage::class,
                RetireAgent::class,
                RecordHeartbeat::class,
                RecordUserHeartbeat::class,
                EnrollHost::class,
                OpenAgentRuntime::class,
                DeliverAgent::class,
                WakeAgent::class,
                ChangeAgentModel::class,
                ChangeAgentEffort::class,
                InterruptAgent::class,
                StopAgent::class,
                ClaimDriverRequests::class,
                ClaimLaunchGrant::class,
                ReportRuntimeActivity::class,
                ReportRequestProgress::class,
                ReportDriverTurn::class,
                ReportRuntimeHeartbeat::class,
                ReportRuntimeExit::class,
                OpenHostMainRuntime::class,
                MarkSilentSessions::class,
                SettleFrameTimes::class,
                SaveSharePreview::class,
                InstallNumbers::class,
                LinkRecords::class,
                UnlinkRecords::class,
                AssignRecord::class,
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
                ResourceMimeTypeRefused::class,
                AccountContainerUnsupported::class,
                ModelRequired::class,
                ModelUnavailable::class,
                DefaultUnavailable::class,
                ProgramRequired::class,
                ProgramConflict::class,
                ProgramUnsupported::class,
                ToolArgumentInvalid::class,
                ToolArgumentUnknown::class,
                ContinuationInvalid::class,
                ContinuationStale::class,
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
