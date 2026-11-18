<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchEnded;
use App\Agents\Events\LaunchTimedOut;
use App\Agents\Models\AgentSession;
use App\Agents\Support\LaunchTimeouts;
use App\Contracts\LaunchTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Follows a launch by its heartbeats. Silence first marks it silent, and a heartbeat makes it active again; a silence
 * past the second limit times it out, and the host's report that the program exited ends it. No end hook is needed.
 */
final readonly class LaunchHeartbeats
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
     * Marks every session without a recent heartbeat silent, and times out every session silent for too long.
     */
    public function markSilentLaunches(): void
    {
        $now = CarbonImmutable::now();
        $overdue = AgentSession::query()->with('credential')
            ->where('status', SessionStatus::Silent->value)
            ->where('silent_since', '<=', $now->subSeconds($this->timeouts->timedOutAfterSeconds))
            ->readAll('every overdue session times out')
            ->get();

        foreach ($overdue as $session) {
            $this->timeOut($session, "silent since {$session->lastSeenAt()->toIso8601String()}");
        }

        AgentSession::markSilentIfNoHeartbeatSince($now->subSeconds($this->timeouts->silentAfterSeconds), $now);
    }

    /**
     * The host saw the program exit, so the session ends at once with that evidence.
     */
    public function markExited(AgentSession $session, string $evidence): void
    {
        $this->transaction->run(function () use ($session, $evidence): void {
            $session->endWithEvidenceAt(CarbonImmutable::now(), "host reported exit: {$evidence}");
            $this->credentials->revoke($session);

            $this->events->dispatch(new LaunchEnded($session->agent_id, $session->id));
        });
    }

    private function timeOut(AgentSession $session, string $evidence): void
    {
        $this->transaction->run(function () use ($session, $evidence): void {
            $session->markTimedOutAt(CarbonImmutable::now(), $evidence);
            $this->credentials->revoke($session);

            $this->events->dispatch(new LaunchTimedOut($session->agent_id, $session->id));
        });
    }
}
