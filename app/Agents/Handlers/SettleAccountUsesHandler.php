<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\SettleAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Exceptions\AccountInUse;
use App\Agents\Models\ProcessStart;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

final readonly class SettleAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(SettleAccountUses $command): void
    {
        $running = ProcessStart::unresolvedCountOf($command->account);

        if ($running > 0) {
            throw AccountInUse::forAccount($command->account, $running);
        }

        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));
    }
}
