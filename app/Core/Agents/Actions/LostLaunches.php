<?php

declare(strict_types=1);

namespace App\Core\Agents\Actions;

use App\Core\Agents\Enums\SessionStatus;
use App\Core\Agents\Events\LaunchLost;
use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\Support\LaunchTimeouts;
use App\Core\Contracts\LaunchTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Decides when a launch is lost. Silence first marks it possibly lost, and only a long silence or the host's report
 * that the program exited marks it lost; a heartbeat makes it active again. No end hook is needed.
 */
final readonly class LostLaunches
{
    public function __construct(
        private LaunchTransaction $transaction,
        private LaunchCredentials $credentials,
        private Dispatcher $events,
        private LaunchTimeouts $timeouts,
    ) {}

    public function recordHeartbeat(AgentSession $session): void
    {
        $session->recordHeartbeatAt(CarbonImmutable::now());
    }

    /**
     * Marks every silent session possibly lost, and every session possibly lost for too long lost.
     */
    public function markSilentLaunches(): void
    {
        $now = CarbonImmutable::now();
        $overdue = AgentSession::query()->with('credential')
            ->where('status', SessionStatus::PossiblyLost->value)
            ->where('suspected_lost_at', '<=', $now->subSeconds($this->timeouts->lostAfterSeconds))
            ->get();

        foreach ($overdue as $session) {
            $this->markLost($session, "silent since {$session->lastSeenAt()->toIso8601String()}");
        }

        AgentSession::markPossiblyLostIfSilentSince($now->subSeconds($this->timeouts->possiblyLostAfterSeconds), $now);
    }

    /**
     * The host saw the program exit, so the loss is confirmed at once with that evidence.
     */
    public function markExited(AgentSession $session, string $evidence): void
    {
        $this->markLost($session, "host reported exit: {$evidence}");
    }

    private function markLost(AgentSession $session, string $evidence): void
    {
        $this->transaction->run(function () use ($session, $evidence): void {
            $session->markLostAt(CarbonImmutable::now(), $evidence);
            $this->credentials->revoke($session);

            $this->events->dispatch(new LaunchLost($session->agent_id, $session->id));
        });
    }
}
