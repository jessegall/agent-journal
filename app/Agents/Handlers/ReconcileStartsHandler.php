<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReconcileStarts;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\ProcessStart;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;

/**
 * Ends the reported starts and tells each account's page once its count changed.
 */
final readonly class ReconcileStartsHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(ReconcileStarts $command): int
    {
        $accounts = $this->stopProven($command->hostId, $command->stoppedStartKeys);

        foreach ($accounts as $account) {
            $this->facts->publishAfterCommit(new AccountUseChanged($account));
        }

        return count($accounts);
    }

    /**
     * Ends the named starts whose host proved their process exited, and answers the accounts they used.
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

        $accounts = [];

        foreach ($starts as $start) {
            $start->stopWithProof();
            DriverSwitch::stoppingOf($start->session_id)?->markStopped();
            $account = $start->accountIdentity();
            $accounts["{$account->type} {$account->id}"] = $account;
        }

        return array_values($accounts);
    }
}
