<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Actors\Contracts\ServerClock;
use App\Actors\Support\PresenceWindow;
use App\Agents\Events\LaunchEnded;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Contracts\LaunchTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Follows a launch by its heartbeats. A session whose beats stop for a presence window is marked silent, which only
 * means absent: silence never times a session out. The host's verified report that the program exited ends it.
 */
final readonly class LaunchHeartbeats
{
    public function __construct(
        private LaunchTransaction $transaction,
        private LaunchCredentials $credentials,
        private Dispatcher $events,
        private PresenceWindow $window,
        private ServerClock $clock,
    ) {}

    /**
     * Marks silent every active session whose last beat, or whose start when it never beat, is a presence window old.
     */
    public function markSilentLaunches(): void
    {
        $now = $this->clock->now();

        AgentSession::markSilentIfNoHeartbeatSince($now->subSeconds($this->window->presenceSeconds), $now);
    }

    /**
     * The host saw the program exit, so the session ends at once with that evidence.
     */
    public function markExited(AgentSession $session, string $evidence): void
    {
        $this->transaction->runForSession($session->id, function () use ($session, $evidence): void {
            $session->endWithEvidenceAt(CarbonImmutable::now(), "host reported exit: {$evidence}");
            $this->credentials->revoke($session);
            AgentRuntime::query()
                ->where('agent_session_id', $session->id)
                ->lockForUpdate()
                ->readLimit(1)
                ->get()
                ->each(fn (AgentRuntime $runtime) => $runtime->closeAfterExit());

            $this->events->dispatch(new LaunchEnded($session->agent_id, $session->id));
        });
    }
}
