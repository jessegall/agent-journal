<?php

declare(strict_types=1);

namespace App\Commands\Accounts\SettleAccountUses;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Exceptions\AccountInUse;
use App\Models\Sessions\SessionProcess;

final readonly class SettleAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(SettleAccountUsesCommand $command): void
    {
        $running = SessionProcess::unresolvedCountOf($command->account);

        if ($running > 0) {
            throw AccountInUse::forAccount($command->account, $running);
        }

        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));
    }
}
