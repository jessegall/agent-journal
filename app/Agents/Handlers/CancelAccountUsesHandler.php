<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\CancelAccountUses;
use App\Contracts\CommandHandler;

/**
 * A launch's session and its process start together, so no launch of the account waits without a process and none
 * is cancelled.
 */
final readonly class CancelAccountUsesHandler implements CommandHandler
{
    public function handle(CancelAccountUses $command): int
    {
        return 0;
    }
}
