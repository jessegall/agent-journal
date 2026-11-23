<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\ReportRequestProgress\ReportRequestProgressCommand;
use App\Enums\HostRefusal;
use App\Enums\RequestProgress;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\StartRecord;

/**
 * Settles what a start's bootstrap proved: the conversation its driver runs makes the start ready, so its held
 * messages go out once and its remembered variant is kept; another conversation than the one it is bound to refuses
 * it with its messages still held; an unseen end leaves it uncertain. A refused start takes no later report.
 */
final readonly class StartIdentity
{
    public function settle(AgentRuntime $runtime, ReportRequestProgressCommand $report): void
    {
        StartRecord::lockedLatestOf($runtime->agent_session_id)
            ->filter(fn (StartRecord $record) => $record->readiness->takesReadiness())
            ->forAll(fn (StartRecord $record) => $this->settleRecord($record, $runtime, $report));
    }

    private function settleRecord(
        StartRecord $record,
        AgentRuntime $runtime,
        ReportRequestProgressCommand $report,
    ): void {
        if ($report->progress === RequestProgress::DeliveryUncertain) {
            $record->markIdentityUncertain();

            return;
        }

        if ($report->progress !== RequestProgress::Applied || $report->actualBinding === null) {
            return;
        }

        $session = AgentSession::query()->with(
            ['agent', 'currentConversation'],
        )->findOrFail($runtime->agent_session_id);

        $resumedConversation = $session->currentConversation?->native_id;

        $isAnotherConversation = $resumedConversation !== null && $resumedConversation !== $report->actualBinding;

        if ($isAnotherConversation || ! $record->bindIdentity($report->actualBinding)) {
            $record->refuseFor(HostRefusal::IdentityMismatch);

            return;
        }

        if ($runtime->remember) {
            $session->agent->preferVariant($runtime->mode);
        }
    }
}
