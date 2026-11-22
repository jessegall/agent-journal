<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Events\AccountsChanged;
use App\Events\AccountSettingsRequested;
use App\Events\AccountUseChanged;
use App\Events\AgentHoldReleased;
use App\Events\AgentRuntimeReassigned;
use App\Events\AssignmentsChanged;
use App\Events\BundleActivated;
use App\Events\ChatMemberJoined;
use App\Events\ChatMemberLeft;
use App\Events\ChatMessageAccepted;
use App\Events\ChatReceiptPresented;
use App\Events\ChatRoleChanged;
use App\Events\CommentPosted;
use App\Events\ContextStarted;
use App\Events\DriverFailed;
use App\Events\DriverRequestRecovered;
use App\Events\EngineTicked;
use App\Events\EvidenceInvalid;
use App\Events\HelperCompletionCertified;
use App\Events\HelperStopHeld;
use App\Events\LaunchCancelled;
use App\Events\LaunchEnded;
use App\Events\LinksRemoved;
use App\Events\MergeOutcomeRecorded;
use App\Events\MessageAnswered;
use App\Events\MessageAnswerRequired;
use App\Events\MessageClaimReleased;
use App\Events\MessageDismissed;
use App\Events\MessageRead;
use App\Events\MessageSent;
use App\Events\MessageTakenUp;
use App\Events\OutputChunkCommitted;
use App\Events\PageChanged;
use App\Events\ProfileRevisionRevoked;
use App\Events\ReceiptDeliveriesScheduled;
use App\Events\ReceiptDeliveryChanged;
use App\Events\RuleActivated;
use App\Events\RuleRejected;
use App\Events\RuleRetired;
use App\Events\RunChanged;
use App\Events\SessionClosed;
use App\Events\SessionOpened;
use App\Events\SessionSkillsIntended;
use App\Events\SettingsChanged;
use App\Events\ShareActivated;
use App\Events\ShareCreated;
use App\Events\ShareExpired;
use App\Events\ShareFailed;
use App\Events\ShareGatewayChanged;
use App\Events\ShareRequested;
use App\Events\ShareRevoked;
use App\Events\ShareScopeChanged;
use App\Events\SkillsChanged;
use App\Events\SpeechOpportunitySettled;
use App\Events\StartAccepted;
use App\Events\StartGrantRequested;
use App\Events\StartSettingsRequested;
use App\Events\StartUnavailable;
use App\Events\StateTypesRequested;
use App\Events\ToolCallFinished;
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
 * The published shape of every event of doc 70 table 1 as it is before plan 40 moves it: whether it is delivered
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
                    'hold' => 'App\Enums\HoldReason',
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
                    'action' => 'App\Enums\RecoveryAction',
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
                    'failure' => 'App\Enums\DriverFailure',
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
                ],
            ],
            StartUnavailable::class => [
                'fields' => [
                    'agentId' => 'string',
                    'driver' => 'string',
                    'reason' => 'App\Enums\StartUnavailableReason',
                ],
            ],
            AssignmentsChanged::class => [
                'fields' => [
                    'operationId' => 'string',
                    'actor' => 'App\Support\ActorIdentity',
                    'reason' => 'App\Enums\AssignmentReason',
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
                    'type' => 'App\Enums\DismissalType',
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
            MessageTakenUp::class => [
                'fields' => [
                    'messageId' => 'string',
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
                    'state' => 'App\Enums\ReceiptDeliveryState',
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
                    'attempt' => 'App\Values\StopAttemptReference',
                ],
            ],
            HelperStopHeld::class => [
                'fields' => [
                    'work' => 'App\Support\RecordIdentity',
                    'attempt' => 'App\Values\StopAttemptReference',
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
            EvidenceInvalid::class => [
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
                    'target' => 'App\Enums\SettingTarget',
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
