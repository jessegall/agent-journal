<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\SettleAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Exceptions\AccountUsesRemain;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class SettleAccountUsesHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(SettleAccountUses $command): void
    {
        $running = ProcessStart::unresolvedCountOf($command->account);

        if ($running > 0) {
            throw AccountUsesRemain::forAccount($command->account, $running);
        }

        $this->events->dispatch(new AccountUseChanged($command->account));
    }
}
