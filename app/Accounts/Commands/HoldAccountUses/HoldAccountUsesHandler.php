<?php

declare(strict_types=1);

namespace App\Accounts\Commands\HoldAccountUses;

use App\Accounts\HeldAccountUses;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Sessions\SessionProcess;

final readonly class HoldAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(HoldAccountUsesCommand $command): HeldAccountUses
    {
        $sessionIds = SessionProcess::resolveUnresolvedSessionIdsOf($command->account);
        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));

        return new HeldAccountUses($command->account, $sessionIds);
    }
}
