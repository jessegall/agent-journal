<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Memory\Api\MemoryNamed;
use Domain\Memory\Api\RemoveMemoryPayload;
use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;

/**
 * Removes a memory.
 */
final readonly class RemoveMemoryController
{
    #[Dispatches(RemoveMemoryCommand::class)]
    public function __invoke(RemoveMemoryPayload $call, CommandBus $commands): MemoryNamed
    {
        return MemoryNamed::from(['memoryId' => $commands->run(new RemoveMemoryCommand($call->memoryId))]);
    }
}
