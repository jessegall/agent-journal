<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Agents\Events\AccountSettingsRequested;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Events\AgentHoldReleased;
use App\Agents\Events\AgentRuntimeReassigned;
use App\Agents\Events\DriverFailed;
use App\Agents\Events\DriverRequestRecovered;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Events\LaunchEnded;
use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Events\SessionClosed;
use App\Agents\Events\SessionOpened;
use App\Agents\Events\StartAccepted;
use App\Agents\Events\StartGrantRequested;
use App\Agents\Events\StartSettingsRequested;
use App\Agents\Events\StartUnavailable;
use App\Assignments\Events\AssignmentsChanged;
use App\Comments\Events\CommentPosted;
use App\Communication\Events\ChatMemberJoined;
use App\Communication\Events\ChatMemberLeft;
use App\Communication\Events\ChatMessageAccepted;
use App\Communication\Events\ChatReceiptPresented;
use App\Communication\Events\ChatRoleChanged;
use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageSent;
use App\Communication\Events\MessageTakenUp;
use App\Communication\Events\ReceiptDeliveriesScheduled;
use App\Communication\Events\ReceiptDeliveryChanged;
use App\Communication\Events\SpeechOpportunitySettled;
use App\Engine\Events\EngineTicked;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Events\ToolCallFinished;
use App\Links\Events\LinksRemoved;
use App\Processes\Events\BundleActivated;
use App\Processes\Events\EvidenceInvalid;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Events\RuleActivated;
use App\Processes\Events\RuleRejected;
use App\Processes\Events\RuleRetired;
use App\Processes\Events\RunChanged;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Settings\Events\SettingsChanged;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareCreated;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Events\ShareGatewayChanged;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Events\ShareScopeChanged;
use App\Skills\Events\SessionSkillsIntended;
use App\Skills\Events\SkillsChanged;
use App\Web\Events\PageChanged;
use Domain\Documents\Api\Events\DocumentClosed;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Api\Events\DocumentDraftSaved;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Api\Events\DraftKept;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanReviewDecided;
use Domain\Plans\Api\Events\PlanReviewRequested;
use Domain\Plans\Api\Events\PlanReviewWithdrawn;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskCheckRecorded;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Api\Events\TaskLogged;
use Domain\Tasks\Api\Events\TaskStartCommitted;
use Domain\Tasks\Api\Events\TaskWaitChanged;
use Domain\Tasks\Events\TaskDescribed;
use Domain\Tasks\Events\TaskStarted;

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
                    'hold' => 'App\Agents\Enums\HoldReason',
                    'actor' => 'App\Actors\Support\ActorIdentity',
                    'reason' => 'string',
                ],
            ],
            AgentRuntimeReassigned::class => [
                'fields' => [
                    'runtimeId' => 'string',
                    'fromHostId' => 'string',
                    'toHostId' => 'string',
                    'processGeneration' => 'int',
                    'actor' => 'App\Actors\Support\ActorIdentity',
                    'proof' => 'string',
                    'reason' => 'string',
                ],
            ],
            DriverRequestRecovered::class => [
                'fields' => [
                    'requestId' => 'string',
                    'action' => 'App\Agents\Enums\RecoveryAction',
                    'actor' => 'App\Actors\Support\ActorIdentity',
                    'reason' => 'string',
                ],
            ],
            LaunchCancelled::class => [
                'fields' => [
                    'work' => 'App\Records\Support\RecordIdentity',
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
                    'failure' => 'App\Agents\Enums\DriverFailure',
                    'account' => '?App\Records\Support\RecordIdentity',
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
                    'authorizedSource' => '?App\Records\Support\RecordIdentity',
                ],
            ],
            StartAccepted::class => [
                'fields' => [
                    'requestId' => 'string',
                    'agentId' => 'string',
                    'sessionId' => 'string',
                    'authorizedSource' => '?App\Records\Support\RecordIdentity',
                ],
            ],
            StartUnavailable::class => [
                'fields' => [
                    'agentId' => 'string',
                    'driver' => 'string',
                    'reason' => 'App\Agents\Enums\StartUnavailableReason',
                ],
            ],
            AssignmentsChanged::class => [
                'fields' => [
                    'operationId' => 'string',
                    'actor' => 'App\Actors\Support\ActorIdentity',
                    'reason' => 'App\Assignments\Enums\AssignmentReason',
                    'changes' => 'array',
                    'occurredAt' => 'DateTimeImmutable',
                ],
            ],
            CommentPosted::class => [
                'fields' => [
                    'commentId' => 'string',
                    'target' => 'App\Records\Support\RecordIdentity',
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
                    'answeredBy' => 'App\Actors\Support\ActorIdentity',
                ],
            ],
            MessageClaimReleased::class => [
                'fields' => [
                    'messageId' => 'string',
                    'claim' => 'App\Assignments\Support\AssignmentReference',
                ],
            ],
            MessageDismissed::class => [
                'fields' => [
                    'messageId' => 'string',
                    'dismissedBy' => 'App\Actors\Support\ActorIdentity',
                    'type' => 'App\Communication\Enums\DismissalType',
                ],
            ],
            MessageRead::class => [
                'fields' => [
                    'messageId' => 'string',
                    'inboxId' => 'string',
                    'reader' => 'App\Actors\Support\ActorIdentity',
                ],
            ],
            MessageSent::class => [
                'fields' => [
                    'messageId' => 'string',
                    'author' => 'App\Actors\Support\ActorIdentity',
                    'sourceInboxId' => 'string',
                    'destinationInboxId' => 'string',
                ],
            ],
            MessageTakenUp::class => [
                'fields' => [
                    'messageId' => 'string',
                    'claimant' => 'App\Actors\Support\ActorIdentity',
                ],
            ],
            ChatMessageAccepted::class => [
                'fields' => [
                    'messageId' => 'string',
                    'author' => 'App\Actors\Support\ActorIdentity',
                    'inboxId' => 'string',
                ],
            ],
            ChatMemberJoined::class => [
                'fields' => [
                    'intervalId' => 'string',
                    'inboxId' => 'string',
                    'member' => 'App\Actors\Support\ActorIdentity',
                ],
            ],
            ChatMemberLeft::class => [
                'fields' => [
                    'intervalId' => 'string',
                    'inboxId' => 'string',
                    'member' => 'App\Actors\Support\ActorIdentity',
                    'reason' => 'App\Communication\Enums\LeaveReason',
                ],
            ],
            ChatRoleChanged::class => [
                'fields' => [
                    'intervalId' => 'string',
                    'inboxId' => 'string',
                    'member' => 'App\Actors\Support\ActorIdentity',
                    'role' => 'App\Communication\Enums\IntervalRole',
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
                    'state' => 'App\Communication\Enums\ReceiptDeliveryState',
                ],
            ],
            SpeechOpportunitySettled::class => [
                'fields' => [
                    'opportunityId' => 'string',
                    'userRootId' => 'string',
                    'speaker' => 'App\Actors\Support\ActorIdentity',
                    'state' => 'App\Communication\Enums\SpeechOpportunityState',
                ],
            ],
            EngineTicked::class => [
                'fields' => [
                    'now' => 'Carbon\CarbonImmutable',
                    'sincePrevious' => 'App\Hooks\Ticks\ElapsedTime',
                ],
            ],
            HelperCompletionCertified::class => [
                'fields' => [
                    'work' => 'App\Records\Support\RecordIdentity',
                    'attempt' => 'App\Hooks\Values\StopAttemptReference',
                ],
            ],
            HelperStopHeld::class => [
                'fields' => [
                    'work' => 'App\Records\Support\RecordIdentity',
                    'attempt' => 'App\Hooks\Values\StopAttemptReference',
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
                    'key' => 'App\Profiles\Values\ProfileKey',
                    'revision' => 'int',
                    'revisionReference' => 'string',
                ],
            ],
            SettingsChanged::class => [
                'fields' => [
                    'owner' => 'string',
                    'target' => 'App\Settings\Enums\SettingTarget',
                    'key' => 'string',
                    'revision' => 'int',
                ],
            ],
            ShareActivated::class => [
                'fields' => [
                    'share' => 'App\Sharing\Support\ShareFact',
                ],
            ],
            ShareCreated::class => [
                'fields' => [
                    'share' => 'App\Sharing\Support\ShareFact',
                ],
            ],
            ShareExpired::class => [
                'fields' => [
                    'share' => 'App\Sharing\Support\ShareFact',
                ],
            ],
            ShareFailed::class => [
                'fields' => [
                    'share' => 'App\Sharing\Support\ShareFact',
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
                    'share' => 'App\Sharing\Support\ShareFact',
                ],
            ],
            ShareRevoked::class => [
                'fields' => [
                    'share' => 'App\Sharing\Support\ShareFact',
                ],
            ],
            ShareScopeChanged::class => [
                'fields' => [
                    'share' => 'App\Sharing\Support\ShareFact',
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
                    'actor' => 'App\Actors\Support\ActorContext',
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
                    'parent' => '?App\Actors\Support\ActorContext',
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
                    'actor' => 'App\Actors\Support\ActorContext',
                ],
            ],
            PlanCancelled::class => [
                'fields' => [
                    'planId' => 'string',
                    'cancelledBy' => 'App\Actors\Support\ActorContext',
                ],
            ],
            PlanFinished::class => [
                'fields' => [
                    'planId' => 'string',
                    'finishedBy' => 'App\Actors\Support\ActorContext',
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
                    'startedBy' => 'App\Actors\Support\ActorContext',
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
                    'target' => 'App\Agents\Values\StackTarget',
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
                    'actor' => 'App\Actors\Support\ActorIdentity',
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
