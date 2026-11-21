<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\HoldAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\HeldAccountUses;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

final readonly class HoldAccountUsesHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(HoldAccountUses $command): HeldAccountUses
    {
        $sessionIds = ProcessStart::unresolvedSessionIdsOf($command->account);
        $this->facts->publishAfterCommit(new AccountUseChanged($command->account));

        return new HeldAccountUses($command->account, $sessionIds);
    }
}
