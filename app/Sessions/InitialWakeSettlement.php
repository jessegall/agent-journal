<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\HostWakeRefusal;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Sessions\Contracts\StartTransaction;

/**
 * Settles a start the host proved it never started: only the start's own initial wake, refused in its claimed attempt,
 * with no process made. Anything else, such as a generic refusal or a stale report, settles nothing, and the session
 * and its credentials stay as they are.
 */
final readonly class InitialWakeSettlement
{
    public function __construct(
        private StartTransaction $transaction,
        private StartHeartbeats $heartbeats,
    ) {}

    /**
     * The wake key of a start's initial wake, which the start gives it.
     */
    public static function keyOf(string $sessionId): string
    {
        return 'start-'.$sessionId;
    }

    public function settle(DriverRequest $starting, AgentRuntime $runtime, NotifyRequestProgressCommand $report): void
    {
        $sessionId = $runtime->agent_session_id;
        $binding = $report->binding;

        $isProvedUnstarted = $starting->isStartingRequestOf($sessionId)
            && $report->hasCreatedNoProcess
            && $report->attempt === $starting->attempt_version
            && $binding?->sessionId === $sessionId
            && $binding->processGeneration === $runtime->process_generation;

        if (! $isProvedUnstarted) {
            return;
        }

        $this->transaction->runForSession($sessionId, function () use ($sessionId, $binding, $report): void {
            $start = SessionProcess::findLockedCurrentOf($sessionId);

            if ($start === null || $start->id !== $binding->sessionProcessId) {
                return;
            }

            $reason = ($report->refusal ?? HostWakeRefusal::Unknown)->startReason();
            $session = AgentSession::query()->findOrFail($sessionId);
            $start->refuse($reason->explanation());

            SessionRequest::query()
                ->underRequest($session->start_request_id)
                ->lockForUpdate()
                ->limit(1)
                ->get()
                ->each(fn (SessionRequest $record) => $record->refuseFor($reason));

            $this->heartbeats->markExited($session, "the host never started it ({$reason->value})");
        });
    }
}
