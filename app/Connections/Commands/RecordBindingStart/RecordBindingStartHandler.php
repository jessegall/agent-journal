<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecordBindingStart;

use App\Connections\Models\BindingStart;
use App\Contracts\CommandHandler;

/**
 * Records the start once; the binding and start id are unique together.
 */
final readonly class RecordBindingStartHandler implements CommandHandler
{
    public function handle(RecordBindingStartCommand $command): void
    {
        BindingStart::create($command->bindingId, $command->startId, $command->sessionId, $command->runtimeId);
    }
}
