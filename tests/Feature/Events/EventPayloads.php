<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Events\Accounts\AccountsChanged;
use App\Events\Accounts\ProfileRevisionRevoked;
use App\Events\Assignments\AssignmentsChanged;
use App\Events\Comments\CommentPosted;
use App\Events\Engine\EngineTicked;
use App\Events\Hooks\ContextStarted;
use App\Events\Hooks\HelperCompletionCertified;
use App\Events\Hooks\HelperStopHeld;
use App\Events\Hooks\StateTypesRequested;
use App\Events\Hooks\ToolCallFinished;
use App\Events\Links\LinksRemoved;
use App\Events\Messages\ChatMemberJoined;
use App\Events\Messages\ChatMemberLeft;
use App\Events\Messages\ChatMessageAccepted;
use App\Events\Messages\ChatReceiptPresented;
use App\Events\Messages\ChatRoleChanged;
use App\Events\Messages\MessageAnswered;
use App\Events\Messages\MessageAnswerRequired;
use App\Events\Messages\MessageClaimed;
use App\Events\Messages\MessageClaimReleased;
use App\Events\Messages\MessageDismissed;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
use App\Events\Messages\ReceiptDeliveriesScheduled;
use App\Events\Messages\ReceiptDeliveryChanged;
use App\Events\Messages\SpeechOpportunitySettled;
use App\Events\Processes\BundleActivated;
use App\Events\Processes\EvidenceFoundInvalid;
use App\Events\Processes\OutputChunkCommitted;
use App\Events\Processes\RuleActivated;
use App\Events\Processes\RuleRejected;
use App\Events\Processes\RuleRetired;
use App\Events\Processes\RunChanged;
use App\Events\Sessions\AccountSettingsRequested;
use App\Events\Sessions\AccountUseChanged;
use App\Events\Sessions\AgentHoldReleased;
use App\Events\Sessions\AgentRuntimeReassigned;
use App\Events\Sessions\DriverFailed;
use App\Events\Sessions\DriverRequestRecovered;
use App\Events\Sessions\LaunchCancelled;
use App\Events\Sessions\LaunchEnded;
use App\Events\Sessions\MergeOutcomeRecorded;
use App\Events\Sessions\SessionClosed;
use App\Events\Sessions\SessionOpened;
use App\Events\Sessions\StartAccepted;
use App\Events\Sessions\StartGrantRequested;
use App\Events\Sessions\StartRefusedWithoutAccount;
use App\Events\Sessions\StartSettingsRequested;
use App\Events\Settings\SettingsChanged;
use App\Events\Sharing\ShareActivated;
use App\Events\Sharing\ShareCreated;
use App\Events\Sharing\ShareExpired;
use App\Events\Sharing\ShareFailed;
use App\Events\Sharing\ShareGatewayChanged;
use App\Events\Sharing\ShareRequested;
use App\Events\Sharing\ShareRevoked;
use App\Events\Sharing\ShareScopeChanged;
use App\Events\Skills\SessionSkillsIntended;
use App\Events\Skills\SkillsChanged;
use App\Events\Web\PageChanged;
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Events\DraftKept;
use Domain\Documents\Events\RecordSettled;
use Domain\Documents\Events\ReportFiled;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Events\PlanStarted;
use Domain\Rules\Events\RuleApproved;
use Domain\Rules\Events\RuleDenied;
use Domain\Rules\Events\RuleRemoved;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskCheckRecorded;
use Domain\Tasks\Events\TaskDescribed;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Events\TaskWaitChanged;

/**
 * The published shape of every event: whether it is delivered
 * after the commit, and its public fields with their types, actor fields included. Requests and projections are
 * named apart, since they do not move.
 */
final class EventPayloads
{
    /**
     * @return array<class-string, array{fields: array<string, string>}>
     */
    public static function facts(): array
    {
        return [
            AgentHoldReleased::class => [
                'fields' => [
                    'runtimeId' => 'string',
                    'hold' => 'App\Enums\Drivers\HoldReason',
                    'actor' => 'App\Support\ActorIdentity',
                    'reason' => 'string',
                ],
            ],
            AgentRuntimeReassigned::class => [
                'fields' => [
                    'runtimeId' => 'string',
                    'fromHostId' => 'string',
                    'toHostId' => 'string',
                    'processGeneration' => 'int',
                    'actor' => 'App\Support\ActorIdentity',
                    'proof' => 'string',
                    'reason' => 'string',
                ],
            ],
            DriverRequestRecovered::class => [
                'fields' => [
                    'requestId' => 'string',
                    'action' => 'App\Enums\Drivers\RecoveryAction',
                    'actor' => 'App\Support\ActorIdentity',
                    'reason' => 'string',
                ],
            ],
            LaunchCancelled::class => [
                'fields' => [
                    'work' => 'App\Support\RecordIdentity',
                ],
            ],
            MergeOutcomeRecorded::class => [
                'fields' => [
                    'attemptId' => 'string',
                ],
            ],
            DriverFailed::class => [
                'fields' => [
                    'agentId' => 'string',
                    'sessionId' => 'string',
                    'driver' => 'string',
                    'failure' => 'App\Enums\Drivers\DriverFailure',
                    'account' => '?App\Support\RecordIdentity',
                    'accountGeneration' => '?int',
                ],
            ],
            SessionClosed::class => [
                'fields' => [
                    'agentId' => 'string',
                    'sessionId' => 'string',
                ],
            ],
            SessionOpened::class => [
                'fields' => [
                    'agentId' => 'string',
                    'sessionId' => 'string',
                    'authorizedSource' => '?App\Support\RecordIdentity',
                ],
            ],
            StartAccepted::class => [
                'fields' => [
                    'requestId' => 'string',
                    'agentId' => 'string',
                    'sessionId' => 'string',
                    'authorizedSource' => '?App\Support\RecordIdentity',
                    'parentAgentId' => '?string',
                ],
            ],
            StartRefusedWithoutAccount::class => [
                'fields' => [
                    'agentId' => 'string',
                    'driver' => 'string',
                    'reason' => 'App\Enums\Sessions\StartUnavailableReason',
                ],
            ],
            AssignmentsChanged::class => [
                'fields' => [
                    'operationId' => 'string',
                    'actor' => 'App\Support\ActorIdentity',
                    'reason' => 'App\Enums\Assignments\AssignmentReason',
                    'changes' => 'array',
                    'occurredAt' => 'DateTimeImmutable',
                ],
            ],
            CommentPosted::class => [
                'fields' => [
                    'commentId' => 'string',
                    'target' => 'App\Support\RecordIdentity',
                ],
            ],
            MessageAnswerRequired::class => [
                'fields' => [
                    'messageId' => 'string',
                    'destinationInboxId' => 'string',
                ],
            ],
            MessageAnswered::class => [
                'fields' => [
                    'messageId' => 'string',
                    'replyId' => 'string',
                    'answeredBy' => 'App\Support\ActorIdentity',
                ],
            ],
            MessageClaimReleased::class => [
                'fields' => [
                    'messageId' => 'string',
                    'claim' => 'App\Support\AssignmentReference',
                ],
            ],
            MessageDismissed::class => [
                'fields' => [
                    'messageId' => 'string',
                    'dismissedBy' => 'App\Support\ActorIdentity',
                    'type' => 'App\Enums\Messages\DismissalType',
                ],
            ],
            MessageRead::class => [
                'fields' => [
                    'messageId' => 'string',
                    'inboxId' => 'string',
                    'reader' => 'App\Support\ActorIdentity',
                ],
            ],
            MessageSent::class => [
                'fields' => [
                    'messageId' => 'string',
                    'author' => 'App\Support\ActorIdentity',
                    'sourceInboxId' => 'string',
                    'destinationInboxId' => 'string',
                ],
            ],
            MessageClaimed::class => [
                'fields' => [
                    'messageId' => 'string',
                    'inboxId' => 'string',
                    'claimant' => 'App\Support\ActorIdentity',
                ],
            ],
            ChatMessageAccepted::class => [
                'fields' => [
                    'messageId' => 'string',
                    'author' => 'App\Support\ActorIdentity',
                    'inboxId' => 'string',
                ],
            ],
            ChatMemberJoined::class => [
                'fields' => [
                    'intervalId' => 'string',
                    'inboxId' => 'string',
                    'member' => 'App\Support\ActorIdentity',
                ],
            ],
            ChatMemberLeft::class => [
                'fields' => [
                    'intervalId' => 'string',
                    'inboxId' => 'string',
                    'member' => 'App\Support\ActorIdentity',
                    'reason' => 'App\Enums\LeaveReason',
                ],
            ],
            ChatRoleChanged::class => [
                'fields' => [
                    'intervalId' => 'string',
                    'inboxId' => 'string',
                    'member' => 'App\Support\ActorIdentity',
                    'role' => 'App\Enums\IntervalRole',
                ],
            ],
            ChatReceiptPresented::class => [
                'fields' => [
                    'receiptId' => 'string',
                    'messageId' => 'string',
                    'intervalId' => 'string',
                ],
            ],
            ReceiptDeliveriesScheduled::class => [
                'fields' => [
                    'deliveryIds' => 'array',
                ],
            ],
            ReceiptDeliveryChanged::class => [
                'fields' => [
                    'deliveryId' => 'string',
                    'receiptId' => 'string',
                    'state' => 'App\Enums\Messages\WakeState',
                ],
            ],
            SpeechOpportunitySettled::class => [
                'fields' => [
                    'opportunityId' => 'string',
                    'userRootId' => 'string',
                    'speaker' => 'App\Support\ActorIdentity',
                    'state' => 'App\Enums\SpeechOpportunityState',
                ],
            ],
            EngineTicked::class => [
                'fields' => [
                    'now' => 'Carbon\CarbonImmutable',
                    'sincePrevious' => 'App\Support\Ticks\ElapsedTime',
                ],
            ],
            HelperCompletionCertified::class => [
                'fields' => [
                    'work' => 'App\Support\RecordIdentity',
                    'attempt' => 'App\Values\StopCheckReference',
                ],
            ],
            HelperStopHeld::class => [
                'fields' => [
                    'work' => 'App\Support\RecordIdentity',
                    'attempt' => 'App\Values\StopCheckReference',
                ],
            ],
            LinksRemoved::class => [
                'fields' => [
                    'linkIds' => 'array',
                ],
            ],
            BundleActivated::class => [
                'fields' => [
                    'projectKey' => 'string',
                    'module' => 'string',
                    'digest' => 'string',
                ],
            ],
            EvidenceFoundInvalid::class => [
                'fields' => [
                    'assessmentId' => 'string',
                    'partRunId' => 'string',
                    'actorType' => 'string',
                    'actorId' => 'string',
                    'codes' => 'array',
                ],
            ],
            OutputChunkCommitted::class => [
                'fields' => [
                    'partRunId' => 'string',
                    'stream' => 'string',
                    'offset' => 'int',
                    'length' => 'int',
                ],
            ],
            RuleActivated::class => [
                'fields' => [
                    'projectKey' => 'string',
                    'ruleId' => 'string',
                    'revision' => 'int',
                    'digest' => 'string',
                    'reason' => 'string',
                ],
            ],
            RuleRejected::class => [
                'fields' => [
                    'proposalId' => 'string',
                    'authorType' => 'string',
                    'authorId' => 'string',
                    'reason' => 'string',
                ],
            ],
            RuleRetired::class => [
                'fields' => [
                    'projectKey' => 'string',
                    'ruleId' => 'string',
                    'revision' => 'int',
                    'reason' => 'string',
                ],
            ],
            ProfileRevisionRevoked::class => [
                'fields' => [
                    'key' => 'App\Values\ProfileKey',
                    'revision' => 'int',
                    'revisionReference' => 'string',
                ],
            ],
            SettingsChanged::class => [
                'fields' => [
                    'owner' => 'string',
                    'target' => 'App\Enums\Settings\SettingTarget',
                    'key' => 'string',
                    'revision' => 'int',
                ],
            ],
            ShareActivated::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            ShareCreated::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            ShareExpired::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            ShareFailed::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            ShareGatewayChanged::class => [
                'fields' => [
                    'configurationId' => 'string',
                    'configurationVersion' => 'int',
                    'isDisabled' => 'bool',
                    'occurredAt' => 'DateTimeImmutable',
                ],
            ],
            ShareRequested::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            ShareRevoked::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            ShareScopeChanged::class => [
                'fields' => [
                    'share' => 'App\Support\ShareFact',
                ],
            ],
            SessionSkillsIntended::class => [
                'fields' => [
                    'publicationId' => 'string',
                ],
            ],
            SkillsChanged::class => [
                'fields' => [
                    'skillId' => 'string',
                    'revision' => 'int',
                ],
            ],
            DocumentClosed::class => [
                'fields' => [
                    'documentId' => 'string',
                    'number' => 'int',
                    'revisionNumber' => 'int',
                ],
            ],
            DocumentCreated::class => [
                'fields' => [
                    'documentId' => 'string',
                    'number' => 'int',
                    'actor' => 'App\Support\ActorContext',
                ],
            ],
            DocumentDraftSaved::class => [
                'fields' => [
                    'documentId' => 'string',
                    'version' => 'int',
                ],
            ],
            DocumentOpened::class => [
                'fields' => [
                    'documentId' => 'string',
                    'number' => 'int',
                ],
            ],
            DocumentPublished::class => [
                'fields' => [
                    'documentId' => 'string',
                    'number' => 'int',
                    'revisionNumber' => 'int',
                ],
            ],
            DraftKept::class => [
                'fields' => [
                    'draftId' => 'string',
                    'documentId' => 'string',
                    'parent' => '?App\Support\ActorContext',
                ],
            ],
            RecordSettled::class => [
                'fields' => [
                    'recordType' => 'string',
                    'recordId' => 'string',
                ],
            ],
            ReportFiled::class => [
                'fields' => [
                    'reportId' => 'string',
                    'number' => 'int',
                    'actor' => 'App\Support\ActorContext',
                ],
            ],
            PlanCancelled::class => [
                'fields' => [
                    'planId' => 'string',
                    'cancelledBy' => 'App\Support\ActorContext',
                ],
            ],
            PlanFinished::class => [
                'fields' => [
                    'planId' => 'string',
                    'finishedBy' => 'App\Support\ActorContext',
                ],
            ],
            PlanReviewDecided::class => [
                'fields' => [
                    'planId' => 'string',
                    'editionId' => 'string',
                    'decision' => 'Domain\Plans\Enums\PlanReviewState',
                ],
            ],
            PlanReviewRequested::class => [
                'fields' => [
                    'planId' => 'string',
                    'editionId' => 'string',
                    'reviewers' => 'array',
                    'planNumber' => 'int',
                ],
            ],
            PlanReviewWithdrawn::class => [
                'fields' => [
                    'planId' => 'string',
                    'editionId' => 'string',
                ],
            ],
            PlanStarted::class => [
                'fields' => [
                    'planId' => 'string',
                    'startedBy' => 'App\Support\ActorContext',
                ],
            ],
            RuleApproved::class => [
                'fields' => [
                    'ruleId' => 'string',
                ],
            ],
            RuleDenied::class => [
                'fields' => [
                    'ruleId' => 'string',
                ],
            ],
            RuleRemoved::class => [
                'fields' => [
                    'ruleId' => 'string',
                ],
            ],
            SequenceStarted::class => [
                'fields' => [
                    'runId' => 'string',
                    'target' => 'App\Values\StackTarget',
                ],
            ],
            TaskBlocked::class => [
                'fields' => [
                    'taskId' => 'string',
                    'previousState' => 'Domain\Tasks\Enums\TaskState',
                    'historyEntryId' => 'string',
                ],
            ],
            TaskDescribed::class => [
                'fields' => ['taskId' => 'string'],
            ],
            TaskCancelled::class => [
                'fields' => [
                    'taskId' => 'string',
                    'previousState' => 'Domain\Tasks\Enums\TaskState',
                    'historyEntryId' => 'string',
                ],
            ],
            TaskFinished::class => [
                'fields' => [
                    'taskId' => 'string',
                    'previousState' => 'Domain\Tasks\Enums\TaskState',
                    'historyEntryId' => 'string',
                ],
            ],
            TaskCheckRecorded::class => [
                'fields' => [
                    'taskId' => 'string',
                    'checkId' => 'string',
                ],
            ],
            TaskLogged::class => [
                'fields' => [
                    'taskId' => 'string',
                    'entryId' => 'string',
                ],
            ],
            TaskWaitChanged::class => [
                'fields' => [
                    'waitId' => 'string',
                    'dependentTaskId' => 'string',
                    'prerequisiteTaskId' => 'string',
                    'change' => 'Domain\Tasks\Enums\TaskWaitChange',
                ],
            ],
            TaskStarted::class => [
                'fields' => [
                    'taskId' => 'string',
                    'actor' => 'App\Support\ActorIdentity',
                    'previousState' => 'Domain\Tasks\Enums\TaskState',
                    'historyEntryId' => 'string',
                ],
            ],
        ];
    }

    /**
     * The requests and projections, each with why it is skipped.
     *
     * @return array<class-string, string>
     */
    public static function skipped(): array
    {
        return [
            AccountSettingsRequested::class => 'request',
            AccountUseChanged::class => 'projection',
            LaunchEnded::class => 'projection',
            StartGrantRequested::class => 'request',
            StartSettingsRequested::class => 'request',
            ContextStarted::class => 'request',
            StateTypesRequested::class => 'request',
            ToolCallFinished::class => 'request',
            RunChanged::class => 'projection',
            AccountsChanged::class => 'projection',
            PageChanged::class => 'projection',
            PlanProgressChanged::class => 'projection',
            TaskStartCommitted::class => 'projection',
        ];
    }
}
