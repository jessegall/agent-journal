<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\HoldAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\HeldAccountUses;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class HoldAccountUsesHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(HoldAccountUses $command): HeldAccountUses
    {
        $sessionIds = ProcessStart::unresolvedSessionIdsOf($command->account);
        $this->events->dispatch(new AccountUseChanged($command->account));

        return new HeldAccountUses($command->account, $sessionIds);
    }
}
