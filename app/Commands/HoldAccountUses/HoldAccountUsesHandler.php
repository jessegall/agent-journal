<?php

declare(strict_types=1);

namespace App\Commands\HoldAccountUses;

use App\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Events\AccountUseChanged;
use App\Models\ProcessStart;
use App\Support\HeldAccountUses;

final readonly class HoldAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(HoldAccountUsesCommand $command): HeldAccountUses
    {
        $sessionIds = ProcessStart::unresolvedSessionIdsOf($command->account);
        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));

        return new HeldAccountUses($command->account, $sessionIds);
    }
}
