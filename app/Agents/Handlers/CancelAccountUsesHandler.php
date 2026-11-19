<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelAccountUses;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelAccountUsesHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(CancelAccountUses $command): int
    {
        $cancelled = ProcessStart::cancelPendingOf($command->account);

        if ($cancelled > 0) {
            $this->events->dispatch(new AccountUseChanged($command->account));
        }

        return $cancelled;
    }
}
