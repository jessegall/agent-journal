<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Memory\Calls\MemoryNamed;
use Domain\Memory\Calls\RemoveMemoryCall;
use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;

/**
 * Removes a memory.
 */
final readonly class RemoveMemoryController
{
    public function __invoke(RemoveMemoryCall $call, CommandBus $commands): MemoryNamed
    {
        return MemoryNamed::from(['memoryId' => $commands->run(new RemoveMemoryCommand($call->memoryId))]);
    }
}
