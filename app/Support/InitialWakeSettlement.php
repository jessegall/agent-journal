<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Contracts\Sessions\StartTransaction;
use App\Enums\HostWakeRefusal;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Starts\ProcessStart;
use App\Models\Starts\StartRecord;

/**
 * Settles a launch the host proved it never started: only the start's own initial wake, refused in the attempt it
 * was claimed for, bound to the session, its start and its process generation, with no process made. Anything less,
 * a generic refusal, a stale or duplicate report or an ordinary message's wake, settles nothing: the wake's request
 * keeps its own failure and the session, its credentials, its capacity and any switch stay as they are.
 */
final readonly class InitialWakeSettlement
{
    public function __construct(
        private StartTransaction $transaction,
        private HeartbeatService $heartbeats,
    ) {}

    /**
     * The wake key of a start's initial wake, which the start gives it.
     */
    public static function keyOf(string $sessionId): string
    {
        return 'start-'.$sessionId;
    }

    public function settle(DriverRequest $wake, AgentRuntime $runtime, NotifyRequestProgressCommand $report): void
    {
        $sessionId = $runtime->agent_session_id;
        $binding = $report->binding;

        $isProvedUnstarted = $wake->isInitialWakeOf($sessionId)
            && $report->hasCreatedNoProcess
            && $report->attempt === $wake->attempt_version
            && $binding?->sessionId === $sessionId
            && $binding->processGeneration === $runtime->process_generation;

        if (! $isProvedUnstarted) {
            return;
        }

        $this->transaction->runForSession($sessionId, function () use ($sessionId, $binding, $report): void {
            $start = ProcessStart::lockedCurrentOf($sessionId);

            if ($start === null || $start->id !== $binding->processStartId) {
                return;
            }

            $reason = ($report->refusal ?? HostWakeRefusal::Unknown)->startReason();
            $session = AgentSession::query()->findOrFail($sessionId);
            $start->refuse($reason->explanation());

            StartRecord::query()
                ->where('request_id', $session->start_request_id)
                ->lockForUpdate()
                ->limit(1)
                ->get()
                ->each(fn (StartRecord $record) => $record->refuseFor($reason));

            $this->heartbeats->markExited($session, "the host never started it ({$reason->value})");
        });
    }
}
