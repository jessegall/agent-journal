<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\HoldAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AccountSessions;
use App\Agents\Support\AccountUse;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class HoldAccountUsesHandler implements CommandHandler
{
    public function __construct(private AccountSessions $sessions, private Dispatcher $events) {}

    /**
     * @return list<AccountUse>
     */
    public function handle(HoldAccountUses $command): array
    {
        $running = $this->sessions->running($command->account)
            ->orderBy('created_at')
            ->readAll('every launch still running on a held account must end before its sign-in changes')
            ->get();

        $this->events->dispatch(new AccountUseChanged($command->account));

        return array_values($running->map(fn (AgentSession $session) => $session->useOf($command->account))->all());
    }
}
