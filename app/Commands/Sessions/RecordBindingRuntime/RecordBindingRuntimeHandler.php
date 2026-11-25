<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RecordBindingRuntime;

use App\Contracts\Bus\CommandHandler;
use App\Models\Sessions\BindingRuntime;

/**
 * Records the start once; the binding and start id are unique together.
 */
final readonly class RecordBindingRuntimeHandler implements CommandHandler
{
    public function handle(RecordBindingRuntimeCommand $command): void
    {
        BindingRuntime::create($command->bindingId, $command->startId, $command->sessionId, $command->runtimeId);
    }
}
