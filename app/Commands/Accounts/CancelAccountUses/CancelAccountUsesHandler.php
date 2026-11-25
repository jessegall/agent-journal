<?php

declare(strict_types=1);

namespace App\Commands\Accounts\CancelAccountUses;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\Agents\ProcessStartState;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Sessions\SessionProcess;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;

final readonly class CancelAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(CancelAccountUsesCommand $command): int
    {
        $cancelled = $this->cancelPendingOf($command->account);

        if ($cancelled > 0) {
            $this->facts->publishAfterCommit(new AccountUseChanged($command->account));
        }

        return $cancelled;
    }

    /**
     * Cancels the account's starts that no host has claimed yet, so they never make a process, and answers how many.
     */
    private function cancelPendingOf(RecordIdentity $account): int
    {
        return SessionProcess::supervised()
            ->onAccount($account)
            ->where('state', ProcessStartState::Pending->value)
            ->update([
                'state' => ProcessStartState::Cancelled->value,
                'ended_at' => CarbonImmutable::now(),
            ]);
    }
}
