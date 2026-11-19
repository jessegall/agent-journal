<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\HoldAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Support\AccountSessions;
use App\Agents\Support\HeldAccountUses;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class HoldAccountUsesHandler implements CommandHandler
{
    public function __construct(private AccountSessions $sessions, private Dispatcher $events) {}

    public function handle(HoldAccountUses $command): HeldAccountUses
    {
        $sessionIds = $this->sessions->running($command->account)
            ->orderBy('created_at')
            ->readAll('every launch still running on a held account must end before its sign-in changes')
            ->pluck('id');

        $this->events->dispatch(new AccountUseChanged($command->account));

        return new HeldAccountUses($command->account, array_values(array_map(strval(...), $sessionIds->all())));
    }
}
