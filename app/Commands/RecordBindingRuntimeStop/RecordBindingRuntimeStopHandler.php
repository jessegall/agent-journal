<?php

declare(strict_types=1);

namespace App\Commands\RecordBindingRuntimeStop;

use App\Contracts\CommandHandler;
use App\Exceptions\PresenceRefused;
use App\Models\ProjectBinding;

/**
 * Locks the binding, refuses a receipt from any host but its own, and takes the receipt.
 */
final readonly class RecordBindingRuntimeStopHandler implements CommandHandler
{
    public function handle(RecordBindingRuntimeStopCommand $command): void
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if ($binding->host_id !== $command->hostId) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        $binding->confirmStop($command->runtimeId);
    }
}
