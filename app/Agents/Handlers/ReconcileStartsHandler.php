<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Actions\StartHeartbeats;
use App\Agents\Commands\ReconcileStarts;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\ProcessStart;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;

/**
 * Ends the reported starts, with the sessions they ran, and tells each account's page once its count changed.
 */
final readonly class ReconcileStartsHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts, private StartHeartbeats $heartbeats) {}

    public function handle(ReconcileStarts $command): int
    {
        $accounts = $this->stopProven($command->hostId, $command->stoppedStartKeys);

        foreach ($accounts as $account) {
            $this->facts->publishAfterCommit(new AccountUseChanged($account));
        }

        return count($accounts);
    }

    /**
     * Ends the named starts whose host proved their process exited, and each session still open on one of them the
     * way a reported exit ends it, so its runtime stops and the agent can start again; answers the accounts they used.
     *
     * @param  list<string>  $keys
     * @return list<RecordIdentity>
     */
    private function stopProven(string $hostId, array $keys): array
    {
        $starts = ProcessStart::supervised()
            ->where('host_id', $hostId)
            ->whereIn('start_key', $keys)
            ->unresolved()
            ->lockForUpdate()
            ->readAll('a host reports a bounded batch of exited starts')
            ->get();

        if ($starts->isEmpty()) {
            return [];
        }

        $sessions = AgentSession::query()
            ->whereKey($starts->pluck('session_id')->unique()->all())
            ->readAll('the sessions of a bounded batch of exited starts')
            ->get()
            ->keyBy('id');
        $accounts = [];

        foreach ($starts as $start) {
            $start->stopWithProof();
            DriverSwitch::stoppingOf($start->session_id)?->markStopped();
            $session = $sessions[$start->session_id];

            if ($session->isActive()) {
                $this->heartbeats->markExited($session, 'the host found its start ended after a restart');
            }

            $account = $start->accountIdentity();
            $accounts["{$account->type} {$account->id}"] = $account;
        }

        return array_values($accounts);
    }
}
