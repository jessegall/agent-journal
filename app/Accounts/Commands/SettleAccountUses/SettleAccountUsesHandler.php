<?php

declare(strict_types=1);

namespace App\Accounts\Commands\SettleAccountUses;

use App\Accounts\Exceptions\AccountInUse;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Sessions\SessionProcess;

final readonly class SettleAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(SettleAccountUsesCommand $command): void
    {
        $running = SessionProcess::countUnresolvedOf($command->account);

        if ($running > 0) {
            throw AccountInUse::forAccount($command->account, $running);
        }

        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));
    }
}
