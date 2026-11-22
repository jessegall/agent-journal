<?php

declare(strict_types=1);

namespace App;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\Endpoint;
use App\Attributes\InCommandTransaction;
use App\Attributes\InPath;
use App\Attributes\JournalRoute;
use App\Attributes\OneLine;
use App\Attributes\OutsideThePlaces;
use App\Attributes\PresentList;
use App\Attributes\RepeatableRead;
use App\Attributes\RequiresListener;
use App\Attributes\RequiresRequestKey;
use App\Attributes\RetainedActorRequestKey;
use App\Attributes\ScriptMember;
use App\Attributes\ScriptObject;
use App\Calls\Assignments\Concerns\NamesExpectedAssignment;
use App\Calls\Assignments\Concerns\NamesRecipient;
use App\Calls\Comments\ListCommentsCall;
use App\Casts\CallKeyCast;
use App\Commands\AbandonNavigation\AbandonNavigationCommand;
use App\Commands\AcknowledgeChatMessages\AcknowledgeChatMessagesCommand;
use App\Commands\AcknowledgePresentation\AcknowledgePresentationCommand;
use App\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\AdvanceAsk\AdvanceAskCommand;
use App\Commands\AnswerChatQuestion\AnswerChatQuestionCommand;
use App\Commands\AnswerMessage\AnswerMessageCommand;
use App\Commands\AnswerNavigation\AnswerNavigationCommand;
use App\Commands\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use App\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\AskQuestion\AskQuestionCommand;
use App\Commands\AssertBindingStart\AssertBindingStartCommand;
use App\Commands\AssignBindingEnvironment\AssignBindingEnvironmentCommand;
use App\Commands\AssignRecord\AssignRecordCommand;
use App\Commands\BeginSignIn\BeginSignInCommand;
use App\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Commands\CancelDriverRequest\CancelDriverRequestCommand;
use App\Commands\CancelKeyScript\CancelKeyScriptCommand;
use App\Commands\CancelLaunch\CancelLaunchCommand;
use App\Commands\CancelPrivateEntry\CancelPrivateEntryCommand;
use App\Commands\CancelProjectCommandRun\CancelProjectCommandRunCommand;
use App\Commands\CancelSignIn\CancelSignInCommand;
use App\Commands\CancelTerminalTake\CancelTerminalTakeCommand;
use App\Commands\CertifyPassedStops\CertifyPassedStopsCommand;
use App\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Commands\CheckTerminalScreen\CheckTerminalScreenCommand;
use App\Commands\ChooseTerminalDraft\ChooseTerminalDraftCommand;
use App\Commands\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\ClaimSpeech\ClaimSpeechCommand;
use App\Commands\CloseTerminalView\CloseTerminalViewCommand;
use App\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Commands\ContinueStart\ContinueStartCommand;
use App\Commands\CopySkill\CopySkillCommand;
use App\Commands\CreateAgent\CreateAgentCommand;
use App\Commands\CreateDesk\CreateDeskCommand;
use App\Commands\CreateShare\CreateShareCommand;
use App\Commands\CreateSkill\CreateSkillCommand;
use App\Commands\DeclineChatQuestion\DeclineChatQuestionCommand;
use App\Commands\DeliverAgent\DeliverAgentCommand;
use App\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Commands\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\DisableShareGateway\DisableShareGatewayCommand;
use App\Commands\DismissAccountNotice\DismissAccountNoticeCommand;
use App\Commands\DismissLaunchOutcome\DismissLaunchOutcomeCommand;
use App\Commands\DismissMessage\DismissMessageCommand;
use App\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Commands\EnableSettingGroup\EnableSettingGroupCommand;
use App\Commands\EndTerminalViews\EndTerminalViewsCommand;
use App\Commands\EnforceLaunchLimits\EnforceLaunchLimitsCommand;
use App\Commands\EnrollHost\EnrollHostCommand;
use App\Commands\ExpireNavigationRequests\ExpireNavigationRequestsCommand;
use App\Commands\FinishProjectCommandRun\FinishProjectCommandRunCommand;
use App\Commands\HandOffCodeReview\HandOffCodeReviewCommand;
use App\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Commands\ImportHelperCommits\ImportHelperCommitsCommand;
use App\Commands\InspectMergeAttempts\InspectMergeAttemptsCommand;
use App\Commands\InstallDesks\InstallDesksCommand;
use App\Commands\InstallNumbers\InstallNumbersCommand;
use App\Commands\InterruptAgent\InterruptAgentCommand;
use App\Commands\InterruptNavigation\InterruptNavigationCommand;
use App\Commands\IssueEvidencePermit\IssueEvidencePermitCommand;
use App\Commands\IssueProjectInvitation\IssueProjectInvitationCommand;
use App\Commands\LinkRecords\LinkRecordsCommand;
use App\Commands\MaintainAccount\MaintainAccountCommand;
use App\Commands\MarkMenuEntryStale\MarkMenuEntryStaleCommand;
use App\Commands\MarkSilentSessions\MarkSilentSessionsCommand;
use App\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\OpenHostMainRuntime\OpenHostMainRuntimeCommand;
use App\Commands\OpenPrivateEntry\OpenPrivateEntryCommand;
use App\Commands\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\PollDeviceGrant\PollDeviceGrantCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Commands\PostComment\PostCommentCommand;
use App\Commands\PostTextComment\PostTextCommentCommand;
use App\Commands\ProveNavigation\ProveNavigationCommand;
use App\Commands\ProvisionActorDesk\ProvisionActorDeskCommand;
use App\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Commands\ReassignAgentRuntime\ReassignAgentRuntimeCommand;
use App\Commands\ReassignRecord\ReassignRecordCommand;
use App\Commands\RecheckAccount\RecheckAccountCommand;
use App\Commands\RecordBindingPresence\RecordBindingPresenceCommand;
use App\Commands\RecordBindingRuntimeStop\RecordBindingRuntimeStopCommand;
use App\Commands\RecordBindingStart\RecordBindingStartCommand;
use App\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Commands\RecordProjectCommandProcess\RecordProjectCommandProcessCommand;
use App\Commands\RecordRuntime\RecordRuntimeCommand;
use App\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use App\Commands\RecoverProjectBinding\RecoverProjectBindingCommand;
use App\Commands\RedeemProjectInvitation\RedeemProjectInvitationCommand;
use App\Commands\RefreshShareScope\RefreshShareScopeCommand;
use App\Commands\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Commands\ReleaseMessageClaim\ReleaseMessageClaimCommand;
use App\Commands\ReleaseSeat\ReleaseSeatCommand;
use App\Commands\ReleaseSpeech\ReleaseSpeechCommand;
use App\Commands\ReleaseTerminalControl\ReleaseTerminalControlCommand;
use App\Commands\RemoveAccount\RemoveAccountCommand;
use App\Commands\RenameAccount\RenameAccountCommand;
use App\Commands\RenewRuntimeLease\RenewRuntimeLeaseCommand;
use App\Commands\RenewTerminalControl\RenewTerminalControlCommand;
use App\Commands\RenewTerminalView\RenewTerminalViewCommand;
use App\Commands\RepairDriverSettings\RepairDriverSettingsCommand;
use App\Commands\ReplaceSeatOccupant\ReplaceSeatOccupantCommand;
use App\Commands\ReplyInChat\ReplyInChatCommand;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Commands\ReportDriverTurn\ReportDriverTurnCommand;
use App\Commands\ReportEntryReplayed\ReportEntryReplayedCommand;
use App\Commands\ReportRequestProgress\ReportRequestProgressCommand;
use App\Commands\ReportRuntimeActivity\ReportRuntimeActivityCommand;
use App\Commands\ReportRuntimeExit\ReportRuntimeExitCommand;
use App\Commands\ReportRuntimeHeartbeat\ReportRuntimeHeartbeatCommand;
use App\Commands\ReportRuntimeScreen\ReportRuntimeScreenCommand;
use App\Commands\RequestShare\RequestShareCommand;
use App\Commands\RequireMessageAnswer\RequireMessageAnswerCommand;
use App\Commands\ResetSetting\ResetSettingCommand;
use App\Commands\ResetSettingGroup\ResetSettingGroupCommand;
use App\Commands\ResolveDriverDelivery\ResolveDriverDeliveryCommand;
use App\Commands\RestoreActorDesk\RestoreActorDeskCommand;
use App\Commands\RestoreSkill\RestoreSkillCommand;
use App\Commands\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Commands\RetireAgent\RetireAgentCommand;
use App\Commands\RetireMenuEntry\RetireMenuEntryCommand;
use App\Commands\RetireSkill\RetireSkillCommand;
use App\Commands\RetryAccountCleanup\RetryAccountCleanupCommand;
use App\Commands\RetryAttemptCleanup\RetryAttemptCleanupCommand;
use App\Commands\RetryDelivery\RetryDeliveryCommand;
use App\Commands\RetryDriverRequest\RetryDriverRequestCommand;
use App\Commands\RetryShare\RetryShareCommand;
use App\Commands\ReviseSkill\ReviseSkillCommand;
use App\Commands\RevokeCommandPermissions\RevokeCommandPermissionsCommand;
use App\Commands\RevokeDeviceGrant\RevokeDeviceGrantCommand;
use App\Commands\RevokeProfiles\RevokeProfilesCommand;
use App\Commands\RevokeProjectBinding\RevokeProjectBindingCommand;
use App\Commands\RevokeProjectBindings\RevokeProjectBindingsCommand;
use App\Commands\RevokeProjectInvitation\RevokeProjectInvitationCommand;
use App\Commands\RevokeShare\RevokeShareCommand;
use App\Commands\RunKeyScript\RunKeyScriptCommand;
use App\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Commands\SeatActor\SeatActorCommand;
use App\Commands\SelectMessage\SelectMessageCommand;
use App\Commands\SendDriverRequestAgain\SendDriverRequestAgainCommand;
use App\Commands\SendMessage\SendMessageCommand;
use App\Commands\SendTerminalInput\SendTerminalInputCommand;
use App\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Commands\SetDecimalSetting\SetDecimalSettingCommand;
use App\Commands\SetIntegerChoice\SetIntegerChoiceCommand;
use App\Commands\SetIntegerSetting\SetIntegerSettingCommand;
use App\Commands\SetStringChoice\SetStringChoiceCommand;
use App\Commands\SetStringSetting\SetStringSettingCommand;
use App\Commands\SettleAccountUses\SettleAccountUsesCommand;
use App\Commands\SettleFrameTimes\SettleFrameTimesCommand;
use App\Commands\SettleMergeOutcomes\SettleMergeOutcomesCommand;
use App\Commands\StartAgent\StartAgentCommand;
use App\Commands\StartDeviceGrant\StartDeviceGrantCommand;
use App\Commands\StartOwnedAgent\StartOwnedAgentCommand;
use App\Commands\StartProfileMain\StartProfileMainCommand;
use App\Commands\StartProjectCommandRun\StartProjectCommandRunCommand;
use App\Commands\StopAgent\StopAgentCommand;
use App\Commands\SubmitPrivateInput\SubmitPrivateInputCommand;
use App\Commands\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Commands\SubmitWorktreeDelivery\SubmitWorktreeDeliveryCommand;
use App\Commands\SwitchAccount\SwitchAccountCommand;
use App\Commands\TakeNextMessages\TakeNextMessagesCommand;
use App\Commands\TakeTerminalControl\TakeTerminalControlCommand;
use App\Commands\UnassignRecord\UnassignRecordCommand;
use App\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Commands\WakeAgent\WakeAgentCommand;
use App\Commands\WithdrawCommandRequest\WithdrawCommandRequestCommand;
use App\Concerns\BoundedReads;
use App\Concerns\CountsLoads;
use App\Concerns\CountsPivotLoads;
use App\Concerns\HasAssignables;
use App\Concerns\HasComments;
use App\Concerns\HasLinkRecords;
use App\Concerns\HasNumber;
use App\Concerns\HasStates;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Concerns\ProvidesModelRecords;
use App\Concerns\RaisesEvents;
use App\Concerns\RendersRefusal;
use App\Console\Concerns\RunsCallPipelines;
use App\Contracts\AccountUses;
use App\Contracts\ActiveAccountReader;
use App\Contracts\ActiveActorCounter;
use App\Contracts\ActiveActorRegistration;
use App\Contracts\Actor;
use App\Contracts\ActorDesks;
use App\Contracts\ActorGuidance;
use App\Contracts\ActorInboxResolver;
use App\Contracts\ActorLabelProvider;
use App\Contracts\ActorLabels;
use App\Contracts\ActorProvider;
use App\Contracts\ActorProviderRegistration;
use App\Contracts\ActorProvisioning;
use App\Contracts\ActorResolver;
use App\Contracts\ActorVisibility;
use App\Contracts\ActorVisibilityProvider;
use App\Contracts\ActorWorkStacks;
use App\Contracts\AdmittedRecipients;
use App\Contracts\AgentDirectory;
use App\Contracts\AgentMessageReader;
use App\Contracts\AgentResolver;
use App\Contracts\AgentStack;
use App\Contracts\AgentStartCommand;
use App\Contracts\Answer;
use App\Contracts\Assignable;
use App\Contracts\AssignableContributor;
use App\Contracts\AssignableProvider;
use App\Contracts\AssignedWorkProvider;
use App\Contracts\AssignedWorkResolver;
use App\Contracts\Assignee;
use App\Contracts\AssigneeContributor;
use App\Contracts\AssigneeProvider;
use App\Contracts\AssigneeResolver;
use App\Contracts\AssignmentDestinationResolver;
use App\Contracts\AssignmentPool;
use App\Contracts\AssignmentPoolFactory;
use App\Contracts\AssignmentQuery;
use App\Contracts\AssignmentRegistration;
use App\Contracts\AssignmentResolver;
use App\Contracts\AssignmentTransaction;
use App\Contracts\AssignmentWriter;
use App\Contracts\AuthoritySource;
use App\Contracts\Authorizer;
use App\Contracts\AuthorizerProvider;
use App\Contracts\AuthorizerProviderRegistration;
use App\Contracts\AutoAssigner;
use App\Contracts\AutoAssignmentActivity;
use App\Contracts\AutoAssignmentProvider;
use App\Contracts\CallerReceipts;
use App\Contracts\CallingDriver;
use App\Contracts\CallRefusal;
use App\Contracts\CallRegistrar;
use App\Contracts\CallSender;
use App\Contracts\CatalogueConstraints;
use App\Contracts\CatalogueValue;
use App\Contracts\ChatDepartures;
use App\Contracts\ChatEligibility;
use App\Contracts\ChatLines;
use App\Contracts\ChatMemberPolicies;
use App\Contracts\ChatParticipationEnding;
use App\Contracts\ChatTimeline;
use App\Contracts\ChoiceLabel;
use App\Contracts\CodedRefusal;
use App\Contracts\Command;
use App\Contracts\CommandBus;
use App\Contracts\CommandClassifier;
use App\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Contracts\CommandMiddleware;
use App\Contracts\CommandMiddlewareProvider;
use App\Contracts\CommandProvider;
use App\Contracts\CommandRefusal;
use App\Contracts\CommandRuleProvider;
use App\Contracts\CommandTransaction;
use App\Contracts\Commentable;
use App\Contracts\CommentResolver;
use App\Contracts\ConditionalState;
use App\Contracts\ConditionalStateType;
use App\Contracts\ConversationResolver;
use App\Contracts\ConversationVisits;
use App\Contracts\CountResolver;
use App\Contracts\CurrentActor;
use App\Contracts\CurrentActorSetter;
use App\Contracts\CurrentAuthorizer;
use App\Contracts\CurrentSession;
use App\Contracts\CurrentState;
use App\Contracts\CurrentUserResolver;
use App\Contracts\DeclaredPages;
use App\Contracts\Desk;
use App\Contracts\DockerImageVerifier;
use App\Contracts\DomainAvailability;
use App\Contracts\DraftProducers;
use App\Contracts\Driver;
use App\Contracts\DriverCapabilities;
use App\Contracts\DriverCatalogue;
use App\Contracts\DriverConversationResolver;
use App\Contracts\EnabledSettingsGroup;
use App\Contracts\EnvironmentTasks;
use App\Contracts\Event;
use App\Contracts\EventSource;
use App\Contracts\FactOrigin;
use App\Contracts\Files;
use App\Contracts\GroupDeclaration;
use App\Contracts\HelperRecordFacts;
use App\Contracts\HostCapabilities;
use App\Contracts\IdentityLinks;
use App\Contracts\Inbox;
use App\Contracts\InboxAccess;
use App\Contracts\InboxDestinationResolver;
use App\Contracts\InboxNotices;
use App\Contracts\InboxProvider;
use App\Contracts\InboxRegistration;
use App\Contracts\InboxResolver;
use App\Contracts\IncomingWork;
use App\Contracts\IncomingWorkProvider;
use App\Contracts\IncomingWorkRegistration;
use App\Contracts\InternalAssignableContributor;
use App\Contracts\JournalAdmission;
use App\Contracts\JournalCall;
use App\Contracts\JournalCommands;
use App\Contracts\LaunchCandidates;
use App\Contracts\LinkRecordProvider;
use App\Contracts\Listener;
use App\Contracts\ListenerFailureLog;
use App\Contracts\MarkdownParts;
use App\Contracts\MembershipEvidence;
use App\Contracts\MenuProvider;
use App\Contracts\MessageCommand;
use App\Contracts\MessageRecipient;
use App\Contracts\MessageSender;
use App\Contracts\NativePartProvider;
use App\Contracts\NativeTurnRecords;
use App\Contracts\NavigationChildren;
use App\Contracts\NavigationProvider;
use App\Contracts\Notifications;
use App\Contracts\NotificationTargetResolver;
use App\Contracts\NotificationTargets;
use App\Contracts\Numbered;
use App\Contracts\OperationPolicy;
use App\Contracts\OperationResolver;
use App\Contracts\OwnerCommands;
use App\Contracts\OwnerPolicy;
use App\Contracts\OwnValuesState;
use App\Contracts\PageOption;
use App\Contracts\PageProvider;
use App\Contracts\PageResolver;
use App\Contracts\Policy;
use App\Contracts\PolicyCatalogue;
use App\Contracts\PolicyProvider;
use App\Contracts\PresentsLayout;
use App\Contracts\ProcessRunCallers;
use App\Contracts\ProfileResolver;
use App\Contracts\ProfileSelections;
use App\Contracts\ProgramClassifier;
use App\Contracts\PublicCommentResolver;
use App\Contracts\ReadableModel;
use App\Contracts\ReadEntitlements;
use App\Contracts\ReadGrant;
use App\Contracts\ReadMeter;
use App\Contracts\RecordCommand;
use App\Contracts\RecordLinker;
use App\Contracts\RecordMenus;
use App\Contracts\RecordPolicy;
use App\Contracts\RecordProvider;
use App\Contracts\RecordResolver;
use App\Contracts\RecordVisibility;
use App\Contracts\ReflectedType;
use App\Contracts\RefusalDetails;
use App\Contracts\ReminderContribution;
use App\Contracts\ReplyInboxes;
use App\Contracts\RequestKey;
use App\Contracts\ResponsibilityWriter;
use App\Contracts\RestrictedPolicy;
use App\Contracts\ResultReceipts;
use App\Contracts\RunClaims;
use App\Contracts\RuntimeResolver;
use App\Contracts\ScriptKeywordDefinition;
use App\Contracts\SeatedActor;
use App\Contracts\SectionProvider;
use App\Contracts\SectionResolver;
use App\Contracts\ServedEnvironment;
use App\Contracts\SessionPolicyReader;
use App\Contracts\SessionProvenance;
use App\Contracts\SessionResolver;
use App\Contracts\Setting;
use App\Contracts\SettingCommands;
use App\Contracts\SettingsAccessPolicy;
use App\Contracts\SettingsCatalogue;
use App\Contracts\SettingsDefinition;
use App\Contracts\SettingsProvider;
use App\Contracts\SettingsResolver;
use App\Contracts\SettingsSnapshot;
use App\Contracts\Shareable;
use App\Contracts\ShareBudget;
use App\Contracts\ShareGateway;
use App\Contracts\ShareGatewayProvider;
use App\Contracts\SharePolicy;
use App\Contracts\ShareRecordContributor;
use App\Contracts\ShareRecordProvider;
use App\Contracts\ShareStatusResolver;
use App\Contracts\ShellCommandParser;
use App\Contracts\SidebarGroupProvider;
use App\Contracts\Skill;
use App\Contracts\SkillCondition;
use App\Contracts\SkillConditionEvaluator;
use App\Contracts\SkillConditionProvider;
use App\Contracts\SkillProvider;
use App\Contracts\SkillResolver;
use App\Contracts\SlotSections;
use App\Contracts\StackEditor;
use App\Contracts\StackTransactionRunner;
use App\Contracts\StartAccounts;
use App\Contracts\StartExecutor;
use App\Contracts\StartReceipts;
use App\Contracts\StartRecordResolver;
use App\Contracts\StartReservations;
use App\Contracts\StateProvider;
use App\Contracts\SupervisorDispatch;
use App\Contracts\SystemEntryPolicies;
use App\Contracts\TargetAuthorizer;
use App\Contracts\TextContent;
use App\Contracts\TextResolver;
use App\Contracts\ToolDiscovery;
use App\Contracts\TypeReflections;
use App\Contracts\UserInterfaceUpdater;
use App\Contracts\UserPresences;
use App\Contracts\UserStack;
use App\Contracts\VerificationTiming;
use App\Contracts\VisibilityCheck;
use App\Contracts\WorkProgress;
use App\Contracts\WorkRepair;
use App\Contracts\WorkspacePolicy;
use App\Contracts\WorkspaceSource;
use App\Contracts\WorkStackProvider;
use App\Contracts\WorkStacks;
use App\Data\AgentChatPart;
use App\Data\AgentInbox;
use App\Data\AgentInboxCounts;
use App\Data\AgentMessageCard;
use App\Data\AgentMessageDetails;
use App\Data\Assignments\RecordHolderData;
use App\Data\BooleanValueData;
use App\Data\ChatEventPage;
use App\Data\ChatEventView;
use App\Data\ClassificationSummaryData;
use App\Data\CommentDetails;
use App\Data\CommentList;
use App\Data\DecimalConstraintsData;
use App\Data\DecimalValueData;
use App\Data\DeliveryView;
use App\Data\DockablePublicationData;
use App\Data\DockDestinationOptionData;
use App\Data\DockOfferData;
use App\Data\DriverRequestStatus;
use App\Data\InboxCounts;
use App\Data\InboxView;
use App\Data\IntegerChoiceConstraintsData;
use App\Data\IntegerChoiceOptionData;
use App\Data\IntegerChoiceValueData;
use App\Data\IntegerConstraintsData;
use App\Data\IntegerValueData;
use App\Data\InvalidValueData;
use App\Data\MessageClaimHolder;
use App\Data\MessagePage;
use App\Data\MessageReadBatch;
use App\Data\MessageReader;
use App\Data\MessageReadResult;
use App\Data\MessageView;
use App\Data\NotificationLink;
use App\Data\NotificationTarget;
use App\Data\PaginationData;
use App\Data\PartSummaryData;
use App\Data\PlainGroupAvailabilityData;
use App\Data\PresentationBatchData;
use App\Data\PresentationItemData;
use App\Data\Profiles\EligibleAccountData;
use App\Data\Profiles\EligibleAccountsData;
use App\Data\RecordCard;
use App\Data\RecordCommentLocation;
use App\Data\RecordCommentView;
use App\Data\RuntimeSetting;
use App\Data\RuntimeStatus;
use App\Data\SettingData;
use App\Data\SettingGroupData;
use App\Data\SettingIdentityData;
use App\Data\SettingsCatalogueData;
use App\Data\SlotSectionData;
use App\Data\SourceActionData;
use App\Data\StringChoiceConstraintsData;
use App\Data\StringChoiceOptionData;
use App\Data\StringChoiceValueData;
use App\Data\StringConstraintsData;
use App\Data\StringValueData;
use App\Data\TerminalControlData;
use App\Data\TerminalInterestData;
use App\Data\TerminalReceiptData;
use App\Data\TextCommentLocation;
use App\Data\TextCommentView;
use App\Data\TextSections;
use App\Data\TextVersionSummary;
use App\Data\ToggleGroupAvailabilityData;
use App\Data\WakeStatus;
use App\Declarations\ActionRoute;
use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceOption;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\FloatSize;
use App\Declarations\IntegerSetting;
use App\Declarations\Menu as UiMenu;
use App\Declarations\MenuItem;
use App\Declarations\NavigationItem;
use App\Declarations\Page as UiPage;
use App\Declarations\PaneChoice;
use App\Declarations\Section;
use App\Declarations\SettingGroup;
use App\Declarations\SidebarGroup;
use App\Declarations\Slot;
use App\Declarations\SlotContext;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;
use App\Declarations\ToggleOption;
use App\Declarations\VerificationContract;
use App\Enums\AccessRuleType;
use App\Enums\AccessType;
use App\Enums\AccountModeType;
use App\Enums\AccountProcessRole;
use App\Enums\ActionMethod;
use App\Enums\ActorType;
use App\Enums\AgentAction;
use App\Enums\AgentInboxState;
use App\Enums\AgentPresence;
use App\Enums\Alignment;
use App\Enums\AnswerType;
use App\Enums\ArrangementType;
use App\Enums\AssessmentOutcome;
use App\Enums\AssignmentOutcomeType;
use App\Enums\AssignmentPurpose;
use App\Enums\AssignmentReason;
use App\Enums\AuthorizationType;
use App\Enums\BindingType;
use App\Enums\CallEffect;
use App\Enums\CapabilityStatusType;
use App\Enums\CapacityResource;
use App\Enums\ChatPermission;
use App\Enums\ClaimedOutcome;
use App\Enums\CommandClass;
use App\Enums\CommandDirectory;
use App\Enums\CommandEffect;
use App\Enums\CommandEffectType;
use App\Enums\CommandEntry;
use App\Enums\CommandRunState;
use App\Enums\CommandScopeType;
use App\Enums\CommandType;
use App\Enums\CommentType;
use App\Enums\ConditionOutcome;
use App\Enums\ConsoleStream;
use App\Enums\ContextStartType;
use App\Enums\ConversationModeType;
use App\Enums\DisclosureState;
use App\Enums\DismissalType;
use App\Enums\DriverCapability;
use App\Enums\DriverFailure;
use App\Enums\DriverOperation;
use App\Enums\DriverOutcome;
use App\Enums\DriverSourceType;
use App\Enums\DriverSwitchStage;
use App\Enums\DriverVariant;
use App\Enums\Emphasis;
use App\Enums\EmptyPolicy;
use App\Enums\EmptySelection;
use App\Enums\EntryType;
use App\Enums\ExecutionModeType;
use App\Enums\ExpectedTiming;
use App\Enums\FileOperation;
use App\Enums\FramingType;
use App\Enums\GroupAvailability;
use App\Enums\HoldReason;
use App\Enums\HostCapabilityType;
use App\Enums\HostRefusal;
use App\Enums\HostWakeRefusal;
use App\Enums\Icon;
use App\Enums\InstancePolicy;
use App\Enums\IntervalRole;
use App\Enums\JournalRouteType;
use App\Enums\LaunchCandidateRank;
use App\Enums\LaunchProfileType;
use App\Enums\LayoutTag;
use App\Enums\LeaveReason;
use App\Enums\LineCardPlacement;
use App\Enums\MenuEntryState;
use App\Enums\MessageState;
use App\Enums\MiddlewareStage;
use App\Enums\ModelSelectionType;
use App\Enums\MountType;
use App\Enums\NarrowView;
use App\Enums\NavigationCompletion;
use App\Enums\NavigationKey;
use App\Enums\NavigationReason;
use App\Enums\NodeType;
use App\Enums\NoSubject;
use App\Enums\NotificationSourceType;
use App\Enums\OfflineReplyMode;
use App\Enums\OperandType;
use App\Enums\Outcome;
use App\Enums\OutputEncoding;
use App\Enums\OutputRequirement;
use App\Enums\PageDestination;
use App\Enums\PageSkeleton;
use App\Enums\ParseOutcome;
use App\Enums\PartJoin;
use App\Enums\PartType;
use App\Enums\Permissions;
use App\Enums\Place;
use App\Enums\PlaceExemption;
use App\Enums\PolicyOriginType;
use App\Enums\PoolInputType;
use App\Enums\PoolMembersType;
use App\Enums\ProfileAudience;
use App\Enums\ProfileChangeType;
use App\Enums\ProgressType;
use App\Enums\ReadEntitlementType;
use App\Enums\ReaderWidth;
use App\Enums\ReadMode;
use App\Enums\ReadView;
use App\Enums\ReceiptOwner;
use App\Enums\ReceiptState;
use App\Enums\RecoveryAction;
use App\Enums\RedirectType;
use App\Enums\RefusalCode;
use App\Enums\ReportLineType;
use App\Enums\RequestHoldReason;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Enums\RequestState;
use App\Enums\ReservationState;
use App\Enums\ResourceType;
use App\Enums\RuntimeActivity;
use App\Enums\ScopeType;
use App\Enums\ScreenReportRefusal;
use App\Enums\SessionEndReason;
use App\Enums\SessionState;
use App\Enums\SessionTransferType;
use App\Enums\SettingAvailability;
use App\Enums\SettingSource;
use App\Enums\SettingsOutcome;
use App\Enums\SettingTarget;
use App\Enums\SettingType;
use App\Enums\ShareRelationType;
use App\Enums\ShareState;
use App\Enums\ShellDialect;
use App\Enums\SignInMethod;
use App\Enums\SkillOrigin;
use App\Enums\SlotContextType;
use App\Enums\StartDisposition;
use App\Enums\StartOriginType;
use App\Enums\StartRefusalType;
use App\Enums\StartRemedyType;
use App\Enums\StartUnavailableReason;
use App\Enums\StatusActionType;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;
use App\Enums\SupervisorCoverageType;
use App\Enums\SupervisorDispatchOutcome;
use App\Enums\SupportState;
use App\Enums\TerminalDraftChoice;
use App\Enums\TerminalGrantState;
use App\Enums\TerminalInputType;
use App\Enums\TerminalNamedKey;
use App\Enums\TerminalReceiptOutcome;
use App\Enums\TextAnchorType;
use App\Enums\TimelineEventType;
use App\Enums\Tone;
use App\Enums\ToolOutcome;
use App\Enums\ToolType;
use App\Enums\UnresolvedType;
use App\Enums\WakeState;
use App\Enums\WholeRecord;
use App\Enums\WordSegmentType;
use App\Enums\WorkRepairOutcome;
use App\Enums\WorkspaceUse;
use App\Events\AccountsChanged;
use App\Events\AccountUseChanged;
use App\Events\AgentHoldReleased;
use App\Events\AgentRuntimeReassigned;
use App\Events\AssignmentsChanged;
use App\Events\CommentPosted;
use App\Events\ContextStarted;
use App\Events\DriverFailed;
use App\Events\DriverRequestRecovered;
use App\Events\EngineTicked;
use App\Events\HelperCompletionCertified;
use App\Events\HelperReportedOnRecord;
use App\Events\HelperSentOnRecord;
use App\Events\HelperStopHeld;
use App\Events\LaunchCancelled;
use App\Events\LaunchEnded;
use App\Events\LinksRemoved;
use App\Events\MessageAnswered;
use App\Events\MessageAnswerRequired;
use App\Events\MessageClaimReleased;
use App\Events\MessageDismissed;
use App\Events\MessageRead;
use App\Events\MessageSent;
use App\Events\MessageTakenUp;
use App\Events\ProfileRevisionRevoked;
use App\Events\RunChanged;
use App\Events\SessionClosed;
use App\Events\SettingsChanged;
use App\Events\ShareActivated;
use App\Events\ShareCreated;
use App\Events\ShareExpired;
use App\Events\ShareFailed;
use App\Events\ShareGatewayChanged;
use App\Events\ShareRequested;
use App\Events\ShareRevoked;
use App\Events\ShareScopeChanged;
use App\Events\StartAccepted;
use App\Events\StartUnavailable;
use App\Events\StateTypesRequested;
use App\Exceptions\AccessPolicyInvalid;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\AccountInUse;
use App\Exceptions\AccountLabelInvalid;
use App\Exceptions\AccountLabelTaken;
use App\Exceptions\AccountMissing;
use App\Exceptions\AccountUnavailable;
use App\Exceptions\AccountUseMissing;
use App\Exceptions\ActiveActorCounterRepeated;
use App\Exceptions\ActorCannotSend;
use App\Exceptions\ActorContextMissing;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\ActorProviderRepeated;
use App\Exceptions\ActorUnavailable;
use App\Exceptions\AgentActorRequired;
use App\Exceptions\AgentBusy;
use App\Exceptions\AgentContextMissing;
use App\Exceptions\AgentNotAvailable;
use App\Exceptions\AgentReservedForReview;
use App\Exceptions\AgentRetirementDenied;
use App\Exceptions\AnchorMismatch;
use App\Exceptions\AnswerImpossible;
use App\Exceptions\AnswerUnreadable;
use App\Exceptions\AssigneeTypeRepeated;
use App\Exceptions\AssigneeUnavailable;
use App\Exceptions\AssignmentConflict;
use App\Exceptions\AssignmentDenied;
use App\Exceptions\AssignmentGroupTooLarge;
use App\Exceptions\AssignmentPoolTooLarge;
use App\Exceptions\AssignmentPoolUnavailable;
use App\Exceptions\AssignmentProviderInvalid;
use App\Exceptions\AssignmentRetryExhausted;
use App\Exceptions\AssignmentRootFinished;
use App\Exceptions\AssignmentTransactionRequired;
use App\Exceptions\AssignmentTypeRepeated;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\AuthorizerProviderRepeated;
use App\Exceptions\AutoAssignmentSizeInvalid;
use App\Exceptions\BuiltInProfileMissing;
use App\Exceptions\CallCancelled;
use App\Exceptions\CallConflict;
use App\Exceptions\CallFailed;
use App\Exceptions\CallKeyConflict;
use App\Exceptions\CallKeyExpired;
use App\Exceptions\CallKeyInvalid;
use App\Exceptions\CallRefused;
use App\Exceptions\CallTooLarge;
use App\Exceptions\CapacityUnavailable;
use App\Exceptions\ChatCursorRefused;
use App\Exceptions\ChatStateConflict;
use App\Exceptions\ClassMissing;
use App\Exceptions\ClientOutOfDate;
use App\Exceptions\CommandDeclarationInvalid;
use App\Exceptions\CommandHandlerMissing;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\CommandListedTwice;
use App\Exceptions\CommandNestingTooDeep;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\CommandRefused;
use App\Exceptions\CommandReplacedWithOtherClass;
use App\Exceptions\CommandReplacementRefused;
use App\Exceptions\CommandResultChanged;
use App\Exceptions\CommandRetryExhausted;
use App\Exceptions\CommandRuleConflict;
use App\Exceptions\CommandRuleInvalid;
use App\Exceptions\CommandStopped;
use App\Exceptions\CommandTransactionMismatch;
use App\Exceptions\CommandTransactionMissing;
use App\Exceptions\CommentUnavailable;
use App\Exceptions\ConsoleOwnerMissing;
use App\Exceptions\ContainerUnavailable;
use App\Exceptions\ContentMissing;
use App\Exceptions\ContentTooLarge;
use App\Exceptions\ContinuationCalledTwice;
use App\Exceptions\ConversationIncompatible;
use App\Exceptions\CrossOwnerReadRefused;
use App\Exceptions\DeadlineExpired;
use App\Exceptions\DecimalInvalid;
use App\Exceptions\DefaultUnavailable;
use App\Exceptions\DeskSeatCountInvalid;
use App\Exceptions\DeskUnavailable;
use App\Exceptions\DockCardInvalid;
use App\Exceptions\DockDefinitionInvalid;
use App\Exceptions\DockSourceUnavailable;
use App\Exceptions\DomainDisabled;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverConflict;
use App\Exceptions\DriverKeyInvalid;
use App\Exceptions\DriverModeAmbiguous;
use App\Exceptions\DriverRegisteredTwice;
use App\Exceptions\DriverRequestMismatch;
use App\Exceptions\DriverRequired;
use App\Exceptions\DriverUnknown;
use App\Exceptions\DriverUnsupported;
use App\Exceptions\EndpointDeclarationInvalid;
use App\Exceptions\EngineActorRequired;
use App\Exceptions\ExecutionBudgetInvalid;
use App\Exceptions\ExecutionPolicyInvalid;
use App\Exceptions\ExplicitTransactionInCommand;
use App\Exceptions\FileExists;
use App\Exceptions\FileJsonInvalid;
use App\Exceptions\FileMissing;
use App\Exceptions\FileOutsidePlaces;
use App\Exceptions\FilePathInvalid;
use App\Exceptions\FileUnreadable;
use App\Exceptions\FileUnwritable;
use App\Exceptions\FolderClosed;
use App\Exceptions\FolderMissing;
use App\Exceptions\GrantNotRegistered;
use App\Exceptions\GrantNotWithheld;
use App\Exceptions\GrantShapeInvalid;
use App\Exceptions\GroupSnapshotRequired;
use App\Exceptions\HookAnswerRefused;
use App\Exceptions\HostCapabilityUnsupported;
use App\Exceptions\ImageUnverified;
use App\Exceptions\InboxProviderInvalid;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\IncomingWorkRepeated;
use App\Exceptions\IncompleteTextAnchor;
use App\Exceptions\InputRefused;
use App\Exceptions\InvalidActorText;
use App\Exceptions\InvalidAssignmentIdentity;
use App\Exceptions\InvalidAssignmentPage;
use App\Exceptions\InvalidRecordIdentity;
use App\Exceptions\InvalidRecordIds;
use App\Exceptions\InvalidRecordReference;
use App\Exceptions\InvalidTextRange;
use App\Exceptions\JournalBusy;
use App\Exceptions\JournalUnavailable;
use App\Exceptions\LayoutRefused;
use App\Exceptions\LazyLoadRefused;
use App\Exceptions\LinkLeavesPlace;
use App\Exceptions\LinkLoop;
use App\Exceptions\MalformedExports;
use App\Exceptions\ManifestRefused;
use App\Exceptions\MarkdownInvalid;
use App\Exceptions\MembershipEvidenceMismatch;
use App\Exceptions\MenuStepRefused;
use App\Exceptions\MessageBodyTooLong;
use App\Exceptions\MessageMissing;
use App\Exceptions\MessageStateConflict;
use App\Exceptions\MessageToSelf;
use App\Exceptions\MiddlewareDeclarationInvalid;
use App\Exceptions\MiddlewareListedTwice;
use App\Exceptions\MiddlewareSkippedCommand;
use App\Exceptions\MiddlewareSwallowedFailure;
use App\Exceptions\ModelReadAllRefused;
use App\Exceptions\ModelRequired;
use App\Exceptions\ModelUnavailable;
use App\Exceptions\MonotonicClockWentBack;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NestedCommandFailureIgnored;
use App\Exceptions\NotAllowed;
use App\Exceptions\NotAuthenticated;
use App\Exceptions\OfflineReplyModeInvalid;
use App\Exceptions\OperationUnavailable;
use App\Exceptions\OutcomeUnknown;
use App\Exceptions\PartMapInvalid;
use App\Exceptions\PlaceUnavailable;
use App\Exceptions\PolicyDefinitionConflict;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\ProfileCannotCoordinate;
use App\Exceptions\ProfileFieldUnknown;
use App\Exceptions\ProfileKeyInvalid;
use App\Exceptions\ProfileMissing;
use App\Exceptions\ProfilePolicyRefused;
use App\Exceptions\ProfileProposalRefused;
use App\Exceptions\ProfileRetired;
use App\Exceptions\ProfileRevisionUnreadable;
use App\Exceptions\ProfilesUnavailable;
use App\Exceptions\ProviderKeyInvalid;
use App\Exceptions\QueryInValueRead;
use App\Exceptions\RaisedOutsideUnit;
use App\Exceptions\ReadLimitExceeded;
use App\Exceptions\ReadLimitInvalid;
use App\Exceptions\ReadLimitTooLarge;
use App\Exceptions\ReadPolicyMissing;
use App\Exceptions\ReadReasonMissing;
use App\Exceptions\ReadShapeUnsupported;
use App\Exceptions\RecordNotFound;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\RelationReadUndeclared;
use App\Exceptions\RowWriteRefused;
use App\Exceptions\RunClaimRefused;
use App\Exceptions\SeatCapacityReached;
use App\Exceptions\SeatConflict;
use App\Exceptions\SecondForwardingSeat;
use App\Exceptions\SectionMissing;
use App\Exceptions\SessionOutdated;
use App\Exceptions\SettingDeclarationInvalid;
use App\Exceptions\SettingDisabled;
use App\Exceptions\SettingHandleUnknown;
use App\Exceptions\SettingReferenceInvalid;
use App\Exceptions\SettingsAccessDenied;
use App\Exceptions\SettingsConflict;
use App\Exceptions\SettingsDocumentInvalid;
use App\Exceptions\SettingsOwnerUnknown;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingsUnavailable;
use App\Exceptions\SettingUnavailable;
use App\Exceptions\SettingValueInvalid;
use App\Exceptions\ShareBudgetExceeded;
use App\Exceptions\SharePreviewRefused;
use App\Exceptions\SharingNotAllowed;
use App\Exceptions\ShellNodeMissing;
use App\Exceptions\ShippedSkillReadOnly;
use App\Exceptions\SignInAttemptMissing;
use App\Exceptions\SignInAttemptStale;
use App\Exceptions\SignInCodeInvalid;
use App\Exceptions\SignInMethodMissing;
use App\Exceptions\SkillConditionInvalid;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillKeyInvalid;
use App\Exceptions\SkillKeyTaken;
use App\Exceptions\SkillOwnerRequired;
use App\Exceptions\SkillRequestReused;
use App\Exceptions\SkillRetired;
use App\Exceptions\SkillRevisionConflict;
use App\Exceptions\SkillSourceInvalid;
use App\Exceptions\StackLockTimedOut;
use App\Exceptions\StackTargetRefused;
use App\Exceptions\StackTransactionRequired;
use App\Exceptions\StaleContinuation;
use App\Exceptions\StartRecordMissing;
use App\Exceptions\StartRefused;
use App\Exceptions\StartRequestConflict;
use App\Exceptions\StateBlocked;
use App\Exceptions\StateReferencesInvalid;
use App\Exceptions\StateSubjectMissing;
use App\Exceptions\StateTypeMissing;
use App\Exceptions\StateTypeRepeated;
use App\Exceptions\StateTypesFrozen;
use App\Exceptions\StopConditionsInvalid;
use App\Exceptions\SubmissionKeyConflict;
use App\Exceptions\SystemActorRequired;
use App\Exceptions\TargetHasNoText;
use App\Exceptions\TargetNotCommentable;
use App\Exceptions\TerminalControlRefused;
use App\Exceptions\TextLineTooLong;
use App\Exceptions\TextMatchInvalid;
use App\Exceptions\TextSelectionRefused;
use App\Exceptions\TextVersionUnavailable;
use App\Exceptions\UnknownAccessType;
use App\Exceptions\UnknownLinkType;
use App\Exceptions\UserActorRequired;
use App\Exceptions\VerificationContractInvalid;
use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Contracts\McpToolProvider;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
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
use App\Models\Support\AssignableListing;
use App\Models\Support\BelongsToOneActor;
use App\Policies\CommentPolicy;
use App\Resolvers\Support\ChatDeliveries;
use App\Support\AccountUseCounts;
use App\Support\ActivityDefinition;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ActorLabelSet;
use App\Support\AgentChatAdmission;
use App\Support\AgentDrivers;
use App\Support\AgentLabel;
use App\Support\AgentOption;
use App\Support\AgentStatus;
use App\Support\AssigneeDefinition;
use App\Support\AssigneeIdentity;
use App\Support\AssigneeList;
use App\Support\AssigneeName;
use App\Support\Assignment;
use App\Support\AssignmentChange;
use App\Support\AssignmentData;
use App\Support\AssignmentGroup;
use App\Support\AssignmentHolder;
use App\Support\AssignmentHolders;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentReference;
use App\Support\AssignmentRequest;
use App\Support\AssignmentResult;
use App\Support\AssignmentSet;
use App\Support\AutoAssignerDefinition;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\BaseOverride;
use App\Support\CallKey;
use App\Support\Cards\Button;
use App\Support\Cards\ChatExcerpt;
use App\Support\Cards\ComposedCard;
use App\Support\Cards\ConsoleOutput;
use App\Support\Cards\Contracts\DockPart;
use App\Support\Cards\CountedProgress;
use App\Support\Cards\DestinationArgument;
use App\Support\Cards\Disclosure;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockDestination;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\DockLink;
use App\Support\Cards\Duration;
use App\Support\Cards\ExcerptMessage;
use App\Support\Cards\Group;
use App\Support\Cards\IndeterminateProgress;
use App\Support\Cards\Row;
use App\Support\Cards\Stack;
use App\Support\Cards\StateLabel;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\ChatInboxes;
use App\Support\ChatInterval;
use App\Support\ChatIntervalEvidence;
use App\Support\ClaimedRequests;
use App\Support\CodeFiles;
use App\Support\Command as BaseCommand;
use App\Support\CommandCall;
use App\Support\CommandName;
use App\Support\CommandScope;
use App\Support\Conditions\AllOf;
use App\Support\Conditions\AnyOf;
use App\Support\Conditions\Conditions;
use App\Support\Conditions\Drivers;
use App\Support\Conditions\Environments;
use App\Support\Conditions\Everyone;
use App\Support\Conditions\Grants;
use App\Support\Conditions\Named;
use App\Support\Conditions\Not;
use App\Support\Conditions\ProfileBases;
use App\Support\Conditions\Profiles;
use App\Support\Conditions\Providers;
use App\Support\ContainerManifest;
use App\Support\CurrentSettingsResolver;
use App\Support\CurrentUser;
use App\Support\Decisions\ContextLine;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\Decisions\StateReferences;
use App\Support\DeskSeatEvidence;
use App\Support\DisabledSettingsGroup;
use App\Support\Domain;
use App\Support\DriverConversationSummary;
use App\Support\EnrolledHost;
use App\Support\ExecutionReceipt;
use App\Support\ExecutionReference;
use App\Support\ExitReceipt;
use App\Support\ExportBuilder;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\GatewayConfiguration;
use App\Support\GatewayEndpoint;
use App\Support\GatewayHealth;
use App\Support\GatewayOperation;
use App\Support\GatewaySettings;
use App\Support\GatewaySetupCheck;
use App\Support\HeldAccountUses;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\InboxIntervals;
use App\Support\InboxMembers;
use App\Support\InboxMembership;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\PromptDetails;
use App\Support\Inputs\Values\SessionEndDetails;
use App\Support\Inputs\Values\SessionStartDetails;
use App\Support\Inputs\Values\StopDetails;
use App\Support\Inputs\Values\ToolResult;
use App\Support\LaunchCandidateFacts;
use App\Support\LaunchCandidateQuery;
use App\Support\LaunchOutcome;
use App\Support\LaunchProfileKey;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutBodyData;
use App\Support\Layout\LayoutDialogData;
use App\Support\Layout\LayoutFactPieceData;
use App\Support\Layout\LayoutFactValueData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutMenuData;
use App\Support\Layout\LayoutMenuGroupData;
use App\Support\Layout\LayoutMenuItemData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutProgressData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\LayoutSplitData;
use App\Support\Layout\LayoutTabData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use App\Support\LinkAccess;
use App\Support\LinkTypeRegistry;
use App\Support\ManifestMount;
use App\Support\MarkdownText;
use App\Support\MiddlewareDeclaration;
use App\Support\MountRules;
use App\Support\NavigationRaiseAnswer;
use App\Support\NumberedPage;
use App\Support\OpenedRuntime;
use App\Support\Operation;
use App\Support\OperationRule;
use App\Support\OrderedRecordIds;
use App\Support\OwnerStartReceipt;
use App\Support\OwnerStartRequest;
use App\Support\Page;
use App\Support\PolicyOverride;
use App\Support\PoolDefinition;
use App\Support\PoolDescription;
use App\Support\PoolMembers;
use App\Support\PoolReference;
use App\Support\PreparedStart;
use App\Support\ProfileProposal;
use App\Support\ProposedProfile;
use App\Support\PublicComment;
use App\Support\PublicCommentPage;
use App\Support\RankedLaunchCandidate;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Support\RecordIds;
use App\Support\RecordReference;
use App\Support\References\Exceptions\ActivationDeclined;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\RefusalReason;
use App\Support\ResumableConversation;
use App\Support\RootRule;
use App\Support\SavedSharePreview;
use App\Support\ScreenReportAnswer;
use App\Support\SeatChangeResult;
use App\Support\Section as TextSection;
use App\Support\SecurityOptions;
use App\Support\SessionOption;
use App\Support\ShareCandidates;
use App\Support\ShareContentRead;
use App\Support\SharedContent;
use App\Support\SharedPage;
use App\Support\SharedPageItem;
use App\Support\ShareFact;
use App\Support\ShareLinkedCandidate;
use App\Support\ShareProposalStatus;
use App\Support\ShareRecordCard;
use App\Support\ShareRecordDefinition;
use App\Support\ShareRecords;
use App\Support\ShareRelation;
use App\Support\ShareRelationRead;
use App\Support\ShareRelationSet;
use App\Support\ShareSelectedTarget;
use App\Support\ShareSelection;
use App\Support\ShareSummary;
use App\Support\ShareTargetRead;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\DestinationGate;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\Contracts\DockableWindow;
use App\Support\Sources\Contracts\DockedSources;
use App\Support\Sources\Contracts\DockOffers;
use App\Support\Sources\Contracts\DockRegistration;
use App\Support\Sources\Contracts\DockSourceChanged;
use App\Support\Sources\Contracts\DockSourceDeleted;
use App\Support\Sources\DockDefinition;
use App\Support\Stack\StateAnswer;
use App\Support\StartReceipt;
use App\Support\StartRecordDetails;
use App\Support\StartRemedy;
use App\Support\StateCatalog\Registration\Contracts\StateRegistration;
use App\Support\StateLoading\Contracts\RecipientStateLoader;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Support\States\AgentState;
use App\Support\StatusAction;
use App\Support\StatusOperation;
use App\Support\TerminalInput;
use App\Support\TextPart;
use App\Support\TextPreview;
use App\Support\TextReading;
use App\Support\TextSearch;
use App\Support\TextSelection;
use App\Support\Ticks\ElapsedTime;
use App\Support\Transformers\CallKeyTransformer;
use App\Support\UnrestrictedAuthorizer;
use App\Support\Wire\Contracts\CardEncoder;
use App\Support\Wire\EncodedCard;
use App\Values\AccessDecision;
use App\Values\AccessPolicy;
use App\Values\AccessRequirement;
use App\Values\AccountUse;
use App\Values\ActivatedProfile;
use App\Values\ArgumentGrammar;
use App\Values\AskTypeKey;
use App\Values\BindingFolder;
use App\Values\BindingOutcome;
use App\Values\BoundTarget;
use App\Values\BrowserInputCapabilities;
use App\Values\CallAccepted;
use App\Values\CallAnswer;
use App\Values\CallToSend;
use App\Values\ChatLine;
use App\Values\ChatMemberAuthority;
use App\Values\Choice;
use App\Values\ChosenAccount;
use App\Values\ClaimedRequest;
use App\Values\ClassFact;
use App\Values\Classification;
use App\Values\CommandClassSet;
use App\Values\CommandFrame;
use App\Values\CommandOperation;
use App\Values\CommandPart;
use App\Values\CommandPattern;
use App\Values\CommandPatternSet;
use App\Values\CommandReport;
use App\Values\CommandRule;
use App\Values\CommandRunStart;
use App\Values\CommitObservation;
use App\Values\ConditionResult;
use App\Values\Decimal;
use App\Values\DeliveryReceipt;
use App\Values\DeliverySubmission;
use App\Values\Depth;
use App\Values\DeviceGrantStart;
use App\Values\DevicePollOutcome;
use App\Values\DraftExpectations;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverReceipt;
use App\Values\DriverRegistration;
use App\Values\DriverResult;
use App\Values\DriverSwitchTarget;
use App\Values\EmptyRunPolicy;
use App\Values\EntryGoalAnswer;
use App\Values\EnvironmentTask;
use App\Values\EnvironmentTaskList;
use App\Values\ExecutableBinding;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionContext;
use App\Values\ExecutionPolicy;
use App\Values\ExitBranch;
use App\Values\ExitPolicy;
use App\Values\ExpectedDraftRevision;
use App\Values\FieldOrigin;
use App\Values\FilePath;
use App\Values\Fingerprint;
use App\Values\FolderEntries;
use App\Values\FolderEntry;
use App\Values\FrameSettlement;
use App\Values\GroupReference;
use App\Values\HelperImportReceipt;
use App\Values\HereDocument;
use App\Values\HostAccess;
use App\Values\HostCapacity;
use App\Values\HostDescriptor;
use App\Values\IssuedInvitation;
use App\Values\LibraryEntryAnswer;
use App\Values\MarkdownPart;
use App\Values\Measurement;
use App\Values\MenuStep;
use App\Values\ModelSelection;
use App\Values\NamedCommand;
use App\Values\NavigationAnswer;
use App\Values\NavigationRound;
use App\Values\NavigationRoundReport;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use App\Values\NextStep;
use App\Values\Operation as PolicyOperation;
use App\Values\OperationGrant;
use App\Values\OperationSupport;
use App\Values\OptionGrammar;
use App\Values\OutputContract;
use App\Values\OwnerAuthority;
use App\Values\PageSize;
use App\Values\PartClassification;
use App\Values\PartProjection;
use App\Values\PinnedDriver;
use App\Values\PolicyDefinition;
use App\Values\PolicyGrant;
use App\Values\PresenceReceipt;
use App\Values\PresenceReport;
use App\Values\PrivateSubmission;
use App\Values\ProcessGrants;
use App\Values\ProfileActivation;
use App\Values\ProfileAuthorization;
use App\Values\ProfileBase;
use App\Values\ProfileDefaults;
use App\Values\ProfileDefinition;
use App\Values\ProfileKey;
use App\Values\ProfileProvenance;
use App\Values\ProfileRevisionReference;
use App\Values\ProfileSelection;
use App\Values\ProfileSnapshot;
use App\Values\ProfileStartPolicy;
use App\Values\ProgramIdentity;
use App\Values\ProgramSpellings;
use App\Values\ProgressPolicy;
use App\Values\ProviderKey;
use App\Values\PublishedResult;
use App\Values\ReadCounts;
use App\Values\ReadEntitlement;
use App\Values\ReaderReference;
use App\Values\ReadOrder;
use App\Values\ReadRequest;
use App\Values\ReceiptAnswer;
use App\Values\RecoveryCall;
use App\Values\Redemption;
use App\Values\Redirect;
use App\Values\RelationRead;
use App\Values\RenderedSkill;
use App\Values\ReportLine;
use App\Values\RequestReportBinding;
use App\Values\ResourceRequest;
use App\Values\RevokedBindings;
use App\Values\RuleOrigin;
use App\Values\RuleReference;
use App\Values\RuleScope;
use App\Values\RuntimeLease;
use App\Values\ScopedRead;
use App\Values\ScriptContext;
use App\Values\ScriptDiff;
use App\Values\ScriptGoal;
use App\Values\ScriptParameter;
use App\Values\ScriptProgress;
use App\Values\ScriptSource;
use App\Values\SectionDraft;
use App\Values\SeenSession;
use App\Values\SelectedAccount;
use App\Values\SelectedDriver;
use App\Values\SelectionSource;
use App\Values\SettingReference;
use App\Values\SettingsChange;
use App\Values\ShellCommand;
use App\Values\ShellNode;
use App\Values\ShellTree;
use App\Values\SignInStarted;
use App\Values\SkillConditionDefinition;
use App\Values\SkillContext;
use App\Values\SkillDraft;
use App\Values\SkillEntry;
use App\Values\SkillKey;
use App\Values\SkillOwner;
use App\Values\SkillRevisionResult;
use App\Values\SkillSection;
use App\Values\SkillSections;
use App\Values\SourceRange;
use App\Values\StackTarget;
use App\Values\StackVerdict;
use App\Values\StartPolicy;
use App\Values\StartProfile;
use App\Values\StartProfileAuthority;
use App\Values\StartProposal;
use App\Values\StartRequest;
use App\Values\StopAttemptReference;
use App\Values\StopCondition;
use App\Values\StopConditions;
use App\Values\SupervisorCoverage;
use App\Values\SupervisorOverride;
use App\Values\SupervisorProfile;
use App\Values\SupervisorRequest;
use App\Values\SupervisorRoutes;
use App\Values\SupervisorTarget;
use App\Values\SupportSnapshot;
use App\Values\SyntaxOrigin;
use App\Values\TextAnchor;
use App\Values\TextRange;
use App\Values\TextVersion;
use App\Values\TimingVerdict;
use App\Values\TreeDiagnostic;
use App\Values\TrustedEntryAuthority;
use App\Values\UnresolvedFact;
use App\Values\WithheldGrant;
use App\Values\Word;
use App\Values\WordSegment;
use App\Values\WorkReference;
use App\Values\WorkRepairRequest;
use App\Values\WorkspaceClone;
use App\Values\WorkspacePreparation;
use App\Values\WorkspaceReadReference;
use App\Contracts\BatchOutcome;
use App\Contracts\ReferenceRecognizer;
use App\Contracts\SearchAccess;
use App\Contracts\SearchProvider;
use App\Enums\FailureReason;
use App\Enums\ScoreTier;
use App\Enums\SearchSurface;
use App\Exceptions\SearchableInvalid;
use App\Exceptions\SearchBatchInvalid;
use App\Exceptions\SearchValueInvalid;
use App\Exceptions\SearchWordsInvalid;
use App\Support\Searchable;
use App\Values\AdmittedConstraints;
use App\Values\AllowedNames;
use App\Values\ExhaustedOutcome;
use App\Values\FailedOutcome;
use App\Values\HitIdentity;
use App\Values\MoreOutcome;
use App\Values\RecognizedReference;
use App\Values\RecordLocation;
use App\Values\RefreshCandidates;
use App\Values\RefreshedOutcome;
use App\Values\ScanningOutcome;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\SourceHit;
use App\Values\SourcePosition;
use App\Values\WorkBudget;
use App\Values\OpenAction;
use App\Values\TieredSearchSource;
use App\Values\SearchableBody;
use App\Support\ReadToolSearchAccess;
use App\Support\MessageSearchAccess;
use App\Support\MessageSearchProvider;
use App\Support\NumberedReferenceRecognizer;
use App\Support\TieredRecordSearch;
use App\Support\StatementDeadline;

/**
 * Core's public surface: every type a domain or module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 * CurrentActorSetter and LinkTypeRegistry are listed for the few places that compose the application (the
 * sign-in middleware and owner providers), not for ordinary use.
 */
final class CoreApi
{
    /**
     * What Core exports and where its listeners live, built once per process: both come from the code alone.
     */
    private static Exports|null $exports = null;

    public static function exports(): Exports
    {
        return self::$exports ??= self::buildExports();
    }

    private static function buildExports(): Exports
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
                HelperSentOnRecord::class,
                HelperReportedOnRecord::class,
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
                DriverFailed::class,
                AccountUseChanged::class,
                AccountsChanged::class,
                RunChanged::class,
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
                AssignableContributor::class,
                AssigneeContributor::class,
                LinkRecordProvider::class,
                StateProvider::class,
                OwnerCommands::class,
                DraftProducers::class,
                ChatDepartures::class,
                ChatTimeline::class,
                ChatParticipationEnding::class,
                ChatEligibility::class,
                MembershipEvidence::class,
                TypeReflections::class,
                ReflectedType::class,
                StartAccounts::class,
                CallerReceipts::class,
                DockSourceDeleted::class,
                DockedSources::class,
                DockOffers::class,
                DockableWindow::class,
                PresentsLayout::class,
                CardContext::class,
                DeclaredPages::class,
                CardEncoder::class,
                SlotSections::class,
                RecordMenus::class,
                DockPart::class,
                Dockable::class,
                DockableProvider::class,
                DockRegistration::class,
                DestinationGate::class,
                DockSourceChanged::class,
                Files::class,
                MarkdownParts::class,
                ReadEntitlements::class,
                JobPermissionReader::class,
                TextFields::class,
                Continuations::class,
                RequestKey::class,
                ReadGrant::class,
                SessionPolicyReader::class,
                LaunchCandidates::class,
                StartReservations::class,
                StartReceipts::class,
                CallingDriver::class,
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
                SearchProvider::class,
                SearchAccess::class,
                ReferenceRecognizer::class,
                BatchOutcome::class,
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
                AgentDirectory::class,
                ToolDiscovery::class,
                StartExecutor::class,
                WorkspaceSource::class,
                HostCapabilities::class,
                StartRecordResolver::class,
                DriverConversationResolver::class,
                DockerImageVerifier::class,
                RecordVisibility::class,
                RuntimeResolver::class,
                AgentStack::class,
                Driver::class,
                DriverCatalogue::class,
                DriverCapabilities::class,
                HelperRecordFacts::class,
                OwnValuesState::class,
                UserStack::class,
                StackTransactionRunner::class,
                StateLoader::class,
                RecipientStateLoader::class,
                Answer::class,
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
                OwnerPolicy::class,
                RecordPolicy::class,
                RestrictedPolicy::class,
                WorkspacePolicy::class,
                PolicyCatalogue::class,
                ActorWorkStacks::class,
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
                RecordCommand::class,
                MessageCommand::class,
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
                ChatLines::class,
                Notifications::class,
                NotificationTargets::class,
                NotificationTargetResolver::class,
                CommentResolver::class,
                ShellCommandParser::class,
                CommandClassifier::class,
                CommandRuleProvider::class,
                ProgramClassifier::class,
                FactOrigin::class,
                ResultReceipts::class,
                ProcessRunCallers::class,
                ServedEnvironment::class,
                EnvironmentTasks::class,
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
                EventSource::class,
                CommandFacts::class,
                JournalCommands::class,
                SystemEntryPolicies::class,
                ChatMemberPolicies::class,
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
                SupervisorDispatch::class,
                WorkRepair::class,
                ActorGuidance::class,
                UserInterfaceUpdater::class,
                CountResolver::class,
                NavigationChildren::class,
                PageOption::class,
                PageResolver::class,
                NavigationProvider::class,
                PageProvider::class,
                SectionProvider::class,
                NativePartProvider::class,
                SidebarGroupProvider::class,
                MenuProvider::class,
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
                TerminalReceiptOutcome::class,
                NarrowView::class,
                LayoutFactPieceData::class,
                ListPage::class,
                DetailPage::class,
                ListEmpty::class,
                ListPaging::class,
                LayoutBackData::class,
                ReaderWidth::class,
                TerminalGrantState::class,
                TerminalReceiptData::class,
                TerminalInputType::class,
                TerminalNamedKey::class,
                TimelineEventType::class,
                LayoutSplitData::class,
                LayoutProgressData::class,
                LayoutDialogData::class,
                LayoutFactValueData::class,
                BrowserInputCapabilities::class,
                ChatMemberAuthority::class,
                ChatPermission::class,
                SeenSession::class,
                RefusalReason::class,
                RevokedBindings::class,
                BindingOutcome::class,
                EligibleAccountsData::class,
                EligibleAccountData::class,
                ReceiptAnswer::class,
                DockOfferData::class,
                DockDestinationOptionData::class,
                ComposedCard::class,
                Button::class,
                ChatExcerpt::class,
                ConsoleOutput::class,
                CountedProgress::class,
                DestinationArgument::class,
                Disclosure::class,
                DockCard::class,
                DockDestination::class,
                DockIdentity::class,
                ChatLine::class,
                LineCardPlacement::class,
                DockLink::class,
                Duration::class,
                EnvironmentTask::class,
                EnvironmentTaskList::class,
                ExcerptMessage::class,
                Group::class,
                IndeterminateProgress::class,
                Row::class,
                Stack::class,
                StateLabel::class,
                Subtitle::class,
                Title::class,
                Alignment::class,
                ConsoleStream::class,
                DisclosureState::class,
                Emphasis::class,
                PartType::class,
                Tone::class,
                DockDefinition::class,
                EncodedCard::class,
                SourceActionData::class,
                SlotSectionData::class,
                FilePath::class,
                OutsideThePlaces::class,
                PlaceExemption::class,
                Permissions::class,
                Place::class,
                Depth::class,
                Fingerprint::class,
                FolderEntries::class,
                FolderEntry::class,
                EntryType::class,
                TextPreview::class,
                CommentPolicy::class,
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
                SupervisorRequest::class,
                WorkRepairRequest::class,
                PaginationData::class,
                NavigationUncertainty::class,
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
                AgentChatPart::class,
                AgentMessageDetails::class,
                AgentInboxState::class,
                ReadView::class,
                NextAction::class,
                OverviewSection::class,
                ListedPage::class,
                PreparedStart::class,
                ExecutionReceipt::class,
                ExecutionReference::class,
                ExitReceipt::class,
                HostCapabilityQuery::class,
                HostCapability::class,
                CapabilityStatusType::class,
                ExecutionModeType::class,
                LaunchProfileType::class,
                AccountModeType::class,
                AgentAction::class,
                AgentPresence::class,
                DriverSwitchStage::class,
                SessionState::class,
                StatusActionType::class,
                HostCapabilityType::class,
                SelectedDriver::class,
                SelectedAccount::class,
                AccountUse::class,
                AccountUseCounts::class,
                HeldAccountUses::class,
                SignInStarted::class,
                AccountProcessRole::class,
                DriverFailure::class,
                ModelSelection::class,
                HostDescriptor::class,
                ChosenAccount::class,
                StartProposal::class,
                DriverSwitchTarget::class,
                SelectionSource::class,
                ProfileDefaults::class,
                ModelSelectionType::class,
                DriverSourceType::class,
                StartRequest::class,
                StartReceipt::class,
                StartRecordDetails::class,
                DriverConversationSummary::class,
                ContainerManifest::class,
                ManifestMount::class,
                MountType::class,
                MountRules::class,
                WorkspaceUse::class,
                WorkspacePreparation::class,
                WorkspaceClone::class,
                SecurityOptions::class,
                HostCapacity::class,
                ReservationState::class,
                StartOriginType::class,
                ConversationModeType::class,
                StartDisposition::class,
                AccessType::class,
                ProfileAudience::class,
                AccessRuleType::class,
                ResourceRequest::class,
                PolicyOperation::class,
                OperationGrant::class,
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
                ScoreTier::class,
                SearchSurface::class,
                FailureReason::class,
                SearchWords::class,
                SearchScope::class,
                SearchReader::class,
                WorkBudget::class,
                SourcePosition::class,
                SearchQuery::class,
                RefreshCandidates::class,
                RecordLocation::class,
                SearchResult::class,
                HitIdentity::class,
                SourceHit::class,
                SearchBatch::class,
                ExhaustedOutcome::class,
                MoreOutcome::class,
                ScanningOutcome::class,
                FailedOutcome::class,
                RefreshedOutcome::class,
                AllowedNames::class,
                AdmittedConstraints::class,
                RecognizedReference::class,
                OpenAction::class,
                TieredSearchSource::class,
                SearchableBody::class,
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
                AgentOption::class,
                AgentStatus::class,
                LaunchOutcome::class,
                StartUnavailableReason::class,
                StartRefusalType::class,
                StartRemedy::class,
                StartRemedyType::class,
                DockablePublicationData::class,
                PublicationPage::class,
                PartProjection::class,
                HostWakeRefusal::class,
                HostRefusal::class,
                RequestReportBinding::class,
                CapacityResource::class,
                StatusAction::class,
                StatusOperation::class,
                ResumableConversation::class,
                StackTarget::class,
                DriverRegistration::class,
                DriverFamily::class,
                PinnedDriver::class,
                SupportSnapshot::class,
                OperationSupport::class,
                BoundTarget::class,
                DriverResult::class,
                DriverCapability::class,
                SupportState::class,
                DriverOutcome::class,
                Decision::class,
                ContextLine::class,
                MessageLine::class,
                StateAnswer::class,
                AnswerType::class,
                StateReference::class,
                TextSection::class,
                TextPart::class,
                TextVersionSummary::class,
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
                NotificationTarget::class,
                NotificationLink::class,
                NotificationSourceType::class,
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
                SupervisorDispatchOutcome::class,
                WorkRepairOutcome::class,
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
                DriverToolInput::class,
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
                TerminalInterestData::class,
                TerminalControlData::class,
                TerminalInput::class,
                PrivateSubmission::class,
                TerminalDraftChoice::class,
                ScreenReportAnswer::class,
                ScreenReportRefusal::class,
                ToolOutcome::class,
                ActorIdentity::class,
                AccessRequirement::class,
                PolicyDefinition::class,
                AssigneeIdentity::class,
                AssignmentRequest::class,
                AssignmentPurpose::class,
                SeatChangeResult::class,
                InboxMembership::class,
                DeskSeatEvidence::class,
                ChatIntervalEvidence::class,
                InboxMembers::class,
                ChatInboxes::class,
                ChatInterval::class,
                InboxIntervals::class,
                PresentationBatchData::class,
                PresentationItemData::class,
                AgentChatAdmission::class,
                AgentDrivers::class,
                ChatDeliveries::class,
                DeliveryView::class,
                WakeState::class,
                ChatEventPage::class,
                ChatEventView::class,
                IntervalRole::class,
                LeaveReason::class,
                ActorLabelSet::class,
                UnrestrictedAuthorizer::class,
                StartProfileAuthority::class,
                OwnerAuthority::class,
                TrustedEntryAuthority::class,
                RecordIdentity::class,
                StopAttemptReference::class,
                AssigneeDefinition::class,
                ActivityDefinition::class,
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
                RecordReference::class,
                Exports::class,
                ExportBuilder::class,
                NumberedPage::class,
                AssignmentHolders::class,
                AssignmentHolder::class,
                OneLine::class,
                RepeatableRead::class,
                RequiresRequestKey::class,
                RetainedActorRequestKey::class,
                ElapsedTime::class,
                FrameSettlement::class,
                MiddlewareStage::class,
                CommandEntry::class,
                CommandScopeType::class,
                CommandScope::class,
                MiddlewareDeclaration::class,
                Authorize::class,
                Effect::class,
                InCommandTransaction::class,
                RequiresListener::class,
                CommandEffectType::class,
                CommandCall::class,
                CommandName::class,
                CurrentUser::class,
                ActionRoute::class,
                DeclaredLayoutData::class,
                LayoutActionData::class,
                LayoutFieldData::class,
                LayoutFormData::class,
                LayoutTabData::class,
                LayoutBodyData::class,
                LayoutNativeData::class,
                PublicationTab::class,
                LayoutPartData::class,
                LayoutRowData::class,
                LayoutTag::class,
                ChoiceOption::class,
                FloatSize::class,
                NavigationItem::class,
                SidebarGroup::class,
                UiMenu::class,
                MenuItem::class,
                LayoutMenuData::class,
                LayoutMenuGroupData::class,
                LayoutMenuItemData::class,
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
                ShareRecordDefinition::class,
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
                IssuedInvitation::class,
                Redemption::class,
                BindingFolder::class,
                PresenceReport::class,
                CommitObservation::class,
                DeliveryReceipt::class,
                RuntimeLease::class,
                DeliverySubmission::class,
                PresenceReceipt::class,
                CommandFrame::class,
                CommandRunStart::class,
                CommandRunState::class,
                DeviceGrantStart::class,
                DevicePollOutcome::class,
                GatewaySettings::class,
                GatewayOperation::class,
                GatewayEndpoint::class,
                GatewaySetupCheck::class,
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
                ArrangementType::class,
                OpenedRuntime::class,
                AutoAssignmentChange::class,
                AutoAssignmentInput::class,
                AutoAssignmentKey::class,
                DriverVariant::class,
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
                InstancePolicy::class,
                OfflineReplyMode::class,
                ProfileSnapshot::class,
                ProfileStartPolicy::class,
                ProfileAuthorization::class,
                WithheldGrant::class,
                PolicyGrant::class,
                ReadEntitlement::class,
                ScopedRead::class,
                HostAccess::class,
                ResourceType::class,
                ReadEntitlementType::class,
                AuthorizationType::class,
                ProfileProvenance::class,
                ProfileSelection::class,
                ProfileProposal::class,
                ProposedProfile::class,
                PolicyOverride::class,
                BaseOverride::class,
                RootRule::class,
                OperationRule::class,
                ProfileChangeType::class,
                SignInMethod::class,
                FieldOrigin::class,
                PolicyOriginType::class,
                ProfileDefinition::class,
                ProfileActivation::class,
                ActivatedProfile::class,
                SkillKey::class,
                DriverKey::class,
                SkillOwner::class,
                SkillOrigin::class,
                Grants::class,
                Profiles::class,
                ProfileBases::class,
                Drivers::class,
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
                SkillConditionDefinition::class,
                SkillEntry::class,
                RenderedSkill::class,
                SkillDraft::class,
                SectionDraft::class,
                SkillRevisionResult::class,
                Conditions::class,
                Everyone::class,
            )
            ->commands(
                ActivateProfilesCommand::class,
                RevokeProfilesCommand::class,
                StartProfileMainCommand::class,
                SwitchAccountCommand::class,
                RenameAccountCommand::class,
                MaintainAccountCommand::class,
                DismissAccountNoticeCommand::class,
                BeginSignInCommand::class,
                BeginSignInAgainCommand::class,
                RemoveAccountCommand::class,
                RetryAccountCleanupCommand::class,
                RecheckAccountCommand::class,
                RetryAttemptCleanupCommand::class,
                CancelSignInCommand::class,
                SubmitSignInCodeCommand::class,
                HoldAccountUsesCommand::class,
                CancelAccountUsesCommand::class,
                SettleAccountUsesCommand::class,
                CreateSkillCommand::class,
                ReviseSkillCommand::class,
                RestoreSkillCommand::class,
                RetireSkillCommand::class,
                CopySkillCommand::class,
                PostCommentCommand::class,
                PostTextCommentCommand::class,
                SendMessageCommand::class,
                PostChatMessageCommand::class,
                AskChatQuestionCommand::class,
                ReplyInChatCommand::class,
                AcknowledgeChatMessagesCommand::class,
                AcknowledgePresentationCommand::class,
                RetryDeliveryCommand::class,
                ClaimSpeechCommand::class,
                ReleaseSpeechCommand::class,
                AnswerChatQuestionCommand::class,
                DeclineChatQuestionCommand::class,
                SelectMessageCommand::class,
                AskQuestionCommand::class,
                AnswerMessageCommand::class,
                AskMessageCommand::class,
                ReadMessagesCommand::class,
                TakeNextMessagesCommand::class,
                ReplyToMessageCommand::class,
                ReleaseMessageClaimCommand::class,
                RequireMessageAnswerCommand::class,
                DismissMessageCommand::class,
                RetireAgentCommand::class,
                StartAgentCommand::class,
                StartOwnedAgentCommand::class,
                CancelLaunchCommand::class,
                DismissLaunchOutcomeCommand::class,
                ContinueStartCommand::class,
                CreateAgentCommand::class,
                RecordHeartbeatCommand::class,
                RecordUserHeartbeatCommand::class,
                EnrollHostCommand::class,
                OpenAgentRuntimeCommand::class,
                DeliverAgentCommand::class,
                RunKeyScriptCommand::class,
                WakeAgentCommand::class,
                ChangeAgentModelCommand::class,
                ChangeAgentEffortCommand::class,
                InterruptAgentCommand::class,
                StopAgentCommand::class,
                ImportHelperCommitsCommand::class,
                RetryDriverRequestCommand::class,
                SendDriverRequestAgainCommand::class,
                CancelDriverRequestCommand::class,
                ResolveDriverDeliveryCommand::class,
                RepairDriverSettingsCommand::class,
                ReleaseAgentHoldCommand::class,
                OpenTerminalViewCommand::class,
                RenewTerminalViewCommand::class,
                CloseTerminalViewCommand::class,
                TakeTerminalControlCommand::class,
                CancelTerminalTakeCommand::class,
                RenewTerminalControlCommand::class,
                ReleaseTerminalControlCommand::class,
                SendTerminalInputCommand::class,
                ChooseTerminalDraftCommand::class,
                CheckTerminalScreenCommand::class,
                OpenPrivateEntryCommand::class,
                SubmitPrivateInputCommand::class,
                CancelPrivateEntryCommand::class,
                AbandonNavigationCommand::class,
                AnswerNavigationCommand::class,
                InterruptNavigationCommand::class,
                ProveNavigationCommand::class,
                RaiseNavigationCommand::class,
                MarkMenuEntryStaleCommand::class,
                ReportEntryReplayedCommand::class,
                RetireMenuEntryCommand::class,
                ResumeKeyScriptCommand::class,
                CancelKeyScriptCommand::class,
                ReassignAgentRuntimeCommand::class,
                RecordRuntimeCommand::class,
                ClaimDriverRequestsCommand::class,
                ReportRuntimeActivityCommand::class,
                ReportRequestProgressCommand::class,
                ReportDriverTurnCommand::class,
                ReportRuntimeHeartbeatCommand::class,
                ReportRuntimeExitCommand::class,
                ReportRuntimeScreenCommand::class,
                OpenHostMainRuntimeCommand::class,
                OpenBindingMainRuntimeCommand::class,
                MarkSilentSessionsCommand::class,
                CertifyPassedStopsCommand::class,
                EndTerminalViewsCommand::class,
                EnforceLaunchLimitsCommand::class,
                AdvanceAskCommand::class,
                HandOffCodeReviewCommand::class,
                SettleMergeOutcomesCommand::class,
                InspectMergeAttemptsCommand::class,
                ExpireNavigationRequestsCommand::class,
                SettleFrameTimesCommand::class,
                SaveSharePreviewCommand::class,
                CreateShareCommand::class,
                RequestShareCommand::class,
                ApproveShareRequestCommand::class,
                RevokeShareCommand::class,
                RevokeCommandPermissionsCommand::class,
                IssueEvidencePermitCommand::class,
                OpenCommandRequestCommand::class,
                WithdrawCommandRequestCommand::class,
                RefreshShareScopeCommand::class,
                RetryShareCommand::class,
                ConfigureShareGatewayCommand::class,
                DisableShareGatewayCommand::class,
                IssueProjectInvitationCommand::class,
                RevokeProjectInvitationCommand::class,
                RedeemProjectInvitationCommand::class,
                RecoverProjectBindingCommand::class,
                RevokeProjectBindingCommand::class,
                RevokeProjectBindingsCommand::class,
                RecordBindingPresenceCommand::class,
                StartProjectCommandRunCommand::class,
                RecordProjectCommandProcessCommand::class,
                FinishProjectCommandRunCommand::class,
                CancelProjectCommandRunCommand::class,
                StartDeviceGrantCommand::class,
                AssertBindingStartCommand::class,
                SubmitWorktreeDeliveryCommand::class,
                RenewRuntimeLeaseCommand::class,
                PollDeviceGrantCommand::class,
                ApproveDeviceGrantCommand::class,
                RevokeDeviceGrantCommand::class,
                AssignBindingEnvironmentCommand::class,
                RecordBindingStartCommand::class,
                RecordBindingRuntimeStopCommand::class,
                InstallNumbersCommand::class,
                LinkRecordsCommand::class,
                UnlinkRecordsCommand::class,
                AssignRecordCommand::class,
                CreateDeskCommand::class,
                InstallDesksCommand::class,
                ProvisionActorDeskCommand::class,
                RestoreActorDeskCommand::class,
                SeatActorCommand::class,
                ReplaceSeatOccupantCommand::class,
                ReleaseSeatCommand::class,
                EnableAutoAssignmentCommand::class,
                ConfigureAutoAssignmentCommand::class,
                DisableAutoAssignmentCommand::class,
                ReassignRecordCommand::class,
                UnassignRecordCommand::class,
                SetStringSettingCommand::class,
                SetBooleanSettingCommand::class,
                SetIntegerSettingCommand::class,
                SetDecimalSettingCommand::class,
                SetStringChoiceCommand::class,
                SetIntegerChoiceCommand::class,
                ResetSettingCommand::class,
                EnableSettingGroupCommand::class,
                DisableSettingGroupCommand::class,
                ResetSettingGroupCommand::class,
            )
            ->exceptions(
                ChatCursorRefused::class,
                HookAnswerRefused::class,
                MembershipEvidenceMismatch::class,
                ChatStateConflict::class,
                TerminalControlRefused::class,
                ClassMissing::class,
                LayoutRefused::class,
                ActivationDeclined::class,
                DockCardInvalid::class,
                DockDefinitionInvalid::class,
                DockSourceUnavailable::class,
                PartMapInvalid::class,
                RowWriteRefused::class,
                RaisedOutsideUnit::class,
                FileMissing::class,
                FileUnreadable::class,
                FileJsonInvalid::class,
                FileOutsidePlaces::class,
                FilePathInvalid::class,
                FolderClosed::class,
                FolderMissing::class,
                LinkLeavesPlace::class,
                LinkLoop::class,
                PlaceUnavailable::class,
                FileExists::class,
                FileUnwritable::class,
                GrantShapeInvalid::class,
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
                SignInMethodMissing::class,
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
                GrantNotRegistered::class,
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
                PolicyDefinitionConflict::class,
                AuthorizerProviderRepeated::class,
                StateTypeRepeated::class,
                StateTypesFrozen::class,
                UnknownLinkType::class,
                StateSubjectMissing::class,
                StackTargetRefused::class,
                SessionOutdated::class,
                StackLockTimedOut::class,
                StackTransactionRequired::class,
                InvalidAssignmentIdentity::class,
                InvalidRecordIdentity::class,
                SearchableInvalid::class,
                SearchBatchInvalid::class,
                SearchValueInvalid::class,
                SearchWordsInvalid::class,
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
                PrivateRecordMissing::class,
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
                DriverRequired::class,
                DriverConflict::class,
                DriverUnsupported::class,
                StartRequestConflict::class,
                AgentBusy::class,
                AgentReservedForReview::class,
                StartRefused::class,
                StartRecordMissing::class,
                ConversationIncompatible::class,
                ManifestRefused::class,
                AccountFolderInvalid::class,
                ContainerUnavailable::class,
                ImageUnverified::class,
                CapacityUnavailable::class,
                UnknownAccessType::class,
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
                GrantNotWithheld::class,
                ProfileRetired::class,
                ProfileRevisionUnreadable::class,
                ProfileFieldUnknown::class,
                ProfileProposalRefused::class,
                ProfilePolicyRefused::class,
                ProfileCannotCoordinate::class,
                SkillDeclarationInvalid::class,
                SkillKeyInvalid::class,
                DriverKeyInvalid::class,
                DriverCapabilityUnsupported::class,
                DriverUnknown::class,
                DriverRegisteredTwice::class,
                DriverModeAmbiguous::class,
                DriverRequestMismatch::class,
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
                Domain::class,
                HasAssignables::class,
                HasLinkRecords::class,
                HasStates::class,
                RaisesEvents::class,
                InsertsAbsentRows::class,
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
                Searchable::class,
                ReadToolSearchAccess::class,
                MessageSearchAccess::class,
                MessageSearchProvider::class,
                NumberedReferenceRecognizer::class,
                TieredRecordSearch::class,
                StatementDeadline::class,
                HasNumber::class,
                AssignableListing::class,
                TextSearch::class,
                ReadsIdempotencyKey::class,
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
     * Core's Listeners folders, app/Listeners and the MCP server's own, for the checked listener provider to discover.
     *
     * @return list<string>
     */
    public static function listenerFolders(): array
    {
        $code = CodeFiles::ofProcess();

        return array_map(
            fn (string $folder) => $code->realPathOf($code->projectPathOf(__DIR__."/{$folder}")),
            ['Listeners', 'Mcp/Listeners'],
        );
    }
}
