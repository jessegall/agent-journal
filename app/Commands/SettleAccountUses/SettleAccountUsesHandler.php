<?php

declare(strict_types=1);

namespace App\Commands\SettleAccountUses;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\AccountUseChanged;
use App\Exceptions\AccountInUse;
use App\Models\Starts\ProcessStart;

final readonly class SettleAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(SettleAccountUsesCommand $command): void
    {
        $running = ProcessStart::unresolvedCountOf($command->account);

        if ($running > 0) {
            throw AccountInUse::forAccount($command->account, $running);
        }

        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));
    }
}
