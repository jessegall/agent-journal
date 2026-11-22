<?php

declare(strict_types=1);

namespace App\Commands\CancelAccountUses;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\ProcessStartState;
use App\Events\AccountUseChanged;
use App\Models\ProcessStart;
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
        return ProcessStart::supervised()
            ->onAccount($account)
            ->where('state', ProcessStartState::Pending->value)
            ->update(['state' => ProcessStartState::Cancelled->value, 'ended_at' => CarbonImmutable::now()]);
    }
}
