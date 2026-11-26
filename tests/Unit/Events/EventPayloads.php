<?php

declare(strict_types=1);

namespace Tests\Unit\Events;

use App\Events\Accounts\AccountsChanged;
use App\Events\Accounts\ProfileRevisionRevoked;
use App\Events\Assignments\AssignmentsChanged;
use App\Events\Engine\EngineTicked;
use App\Events\Hooks\ContextStarted;
use App\Events\Hooks\HelperCompletionCertified;
use App\Events\Hooks\HelperStopHeld;
use App\Events\Hooks\StateTypesRequested;
use App\Events\Hooks\ToolCallFinished;
use App\Events\Links\LinksRemoved;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
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
use App\Events\Sessions\SessionClosed;
use App\Events\Sessions\SessionOpened;
use App\Events\Sessions\SessionStartCancelled;
use App\Events\Sessions\SessionStartEnded;
use App\Events\Sessions\StartAccepted;
use App\Events\Sessions\StartGrantRequested;
use App\Events\Sessions\StartRefusedWithoutAccount;
use App\Events\Sessions\StartSettingsRequested;
use App\Events\Settings\SettingsChanged;
use App\Events\Skills\SkillsChanged;
use App\Events\Web\PageChanged;
use Domain\Comments\Events\CommentPosted;
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
use Domain\Sharing\Events\ShareActivated;
use Domain\Sharing\Events\ShareCreated;
use Domain\Sharing\Events\ShareExpired;
use Domain\Sharing\Events\ShareFailed;
use Domain\Sharing\Events\ShareGatewayChanged;
use Domain\Sharing\Events\ShareRequested;
use Domain\Sharing\Events\ShareRevoked;
use Domain\Sharing\Events\ShareScopeChanged;
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
                    'hold' => 'App\Agents\Drivers\Enums\HoldReason',
                    'actor' => 'App\Support\ActorReference',
                    'reason' => 'string',
                ],
            ],
            AgentRuntimeReassigned::class => [
                'fields' => [
                    'runtimeId' => 'string',
                    'fromHostId' => 'string',
                    'toHostId' => 'string',
                    'processGeneration' => 'int',
                    'actor' => 'App\Support\ActorReference',
                    'proof' => 'string',
                    'reason' => 'string',
                ],
            ],
            DriverRequestRecovered::class => [
                'fields' => [
                    'requestId' => 'string',
                    'action' => 'App\Agents\Drivers\Enums\RecoveryAction',
                    'actor' => 'App\Support\ActorReference',
                    'reason' => 'string',
                ],
            ],
            SessionStartCancelled::class => [
                'fields' => [
                    'work' => 'App\Support\RecordIdentity',
                ],
            ],
            DriverFailed::class => [
                'fields' => [
                    'agentId' => 'string',
                    'sessionId' => 'string',
                    'driver' => 'string',
                    'failure' => 'App\Agents\Drivers\Enums\DriverFailure',
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
                ],
            ],
            StartAccepted::class => [
                'fields' => [
                    'requestId' => 'string',
                    'agentId' => 'string',
                    'sessionId' => 'string',
                    'parentAgentId' => '?string',
                ],
            ],
            StartRefusedWithoutAccount::class => [
                'fields' => [
                    'agentId' => 'string',
                    'driver' => 'string',
                    'reason' => 'App\Sessions\Enums\StartUnavailableReason',
                ],
            ],
            AssignmentsChanged::class => [
                'fields' => [
                    'operationId' => 'string',
                    'actor' => 'App\Support\ActorReference',
                    'reason' => 'App\Assignments\Enums\AssignmentReason',
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
            MessageRead::class => [
                'fields' => [
                    'messageId' => 'string',
                    'inboxId' => 'string',
                    'reader' => 'App\Support\ActorReference',
                ],
            ],
            MessageSent::class => [
                'fields' => [
                    'messageId' => 'string',
                    'inboxId' => 'string',
                    'number' => 'int',
                    'targetMessageId' => '?string',
                    'sender' => 'App\Support\ActorReference',
                ],
            ],
            EngineTicked::class => [
                'fields' => [
                    'now' => 'Carbon\CarbonImmutable',
                    'sincePrevious' => 'App\Engine\Ticks\ElapsedTime',
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
                    'projectId' => 'string',
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
                    'projectId' => 'string',
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
                    'projectId' => 'string',
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
                    'target' => 'App\Settings\Enums\SettingTarget',
                    'key' => 'string',
                    'revision' => 'int',
                ],
            ],
            ShareActivated::class => [
                'fields' => [
                    'share' => 'Domain\Sharing\Support\ShareFact',
                ],
            ],
            ShareCreated::class => [
                'fields' => [
                    'share' => 'Domain\Sharing\Support\ShareFact',
                ],
            ],
            ShareExpired::class => [
                'fields' => [
                    'share' => 'Domain\Sharing\Support\ShareFact',
                ],
            ],
            ShareFailed::class => [
                'fields' => [
                    'share' => 'Domain\Sharing\Support\ShareFact',
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
                    'share' => 'Domain\Sharing\Support\ShareFact',
                ],
            ],
            ShareRevoked::class => [
                'fields' => [
                    'share' => 'Domain\Sharing\Support\ShareFact',
                ],
            ],
            ShareScopeChanged::class => [
                'fields' => [
                    'share' => 'Domain\Sharing\Support\ShareFact',
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
                    'actor' => 'App\Support\ActorReference',
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
                    'parent' => '?App\Support\ActorReference',
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
                    'actor' => 'App\Support\ActorReference',
                ],
            ],
            PlanCancelled::class => [
                'fields' => [
                    'planId' => 'string',
                    'cancelledBy' => 'App\Support\ActorReference',
                ],
            ],
            PlanFinished::class => [
                'fields' => [
                    'planId' => 'string',
                    'finishedBy' => 'App\Support\ActorReference',
                ],
            ],
            PlanReviewDecided::class => [
                'fields' => [
                    'planId' => 'string',
                    'editionId' => 'string',
                    'decision' => 'Domain\Plans\Enums\PlanReviewStatus',
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
                    'startedBy' => 'App\Support\ActorReference',
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
                    'previousState' => 'Domain\Tasks\Enums\TaskStatus',
                    'historyEntryId' => 'string',
                ],
            ],
            TaskDescribed::class => [
                'fields' => ['taskId' => 'string'],
            ],
            TaskCancelled::class => [
                'fields' => [
                    'taskId' => 'string',
                    'previousState' => 'Domain\Tasks\Enums\TaskStatus',
                    'historyEntryId' => 'string',
                ],
            ],
            TaskFinished::class => [
                'fields' => [
                    'taskId' => 'string',
                    'previousState' => 'Domain\Tasks\Enums\TaskStatus',
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
                    'taskId' => 'string',
                    'prerequisiteTaskId' => 'string',
                    'change' => 'Domain\Tasks\Enums\TaskWaitChange',
                ],
            ],
            TaskStarted::class => [
                'fields' => [
                    'taskId' => 'string',
                    'actor' => 'App\Support\ActorReference',
                    'previousState' => 'Domain\Tasks\Enums\TaskStatus',
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
            SessionStartEnded::class => 'projection',
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
