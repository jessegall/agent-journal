<?php

declare(strict_types=1);

namespace App\Core\Agents;

use App\Core\Agents\Events\LaunchLost;
use App\Core\Agents\Models\AgentSession;
use App\Core\Contracts\LaunchTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Decides when a launch is lost. Silence first makes the loss suspected, and only a long silence or the host's
 * report that the program exited confirms it; a heartbeat withdraws a suspicion. No end hook is needed.
 */
final readonly class ConfirmLaunchLoss
{
    public function __construct(
        private LaunchTransaction $transaction,
        private LaunchCredentials $credentials,
        private Dispatcher $events,
        private LossTimes $times,
    ) {}

    public function recordHeartbeat(AgentSession $session): void
    {
        $session->beatAt(CarbonImmutable::now());
    }

    /**
     * Suspects every silent session and confirms every suspicion that lasted too long.
     */
    public function reconcile(): void
    {
        $now = CarbonImmutable::now();
        $overdue = AgentSession::query()->with('credential')
            ->where('status', SessionStatus::SuspectedLost->value)
            ->where('suspected_lost_at', '<=', $now->subSeconds($this->times->confirmAfterSeconds))
            ->get();

        foreach ($overdue as $session) {
            $this->confirm($session, "silent since {$session->lastSeenAt()->toIso8601String()}");
        }

        AgentSession::suspectSilentSince($now->subSeconds($this->times->suspectAfterSeconds), $now);
    }

    /**
     * The host saw the program exit, so the loss is confirmed at once with that evidence.
     */
    public function confirmHostExit(AgentSession $session, string $evidence): void
    {
        $this->confirm($session, "host reported exit: {$evidence}");
    }

    private function confirm(AgentSession $session, string $evidence): void
    {
        $this->transaction->run(function () use ($session, $evidence): void {
            $session->confirmLossAt(CarbonImmutable::now(), $evidence);
            $this->credentials->revoke($session);

            $this->events->dispatch(new LaunchLost($session->agent_id, $session->id));
        });
    }
}
