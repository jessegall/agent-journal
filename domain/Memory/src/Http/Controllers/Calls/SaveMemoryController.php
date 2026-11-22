<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Memory\Calls\MemoryNamed;
use Domain\Memory\Calls\SaveMemoryCall;
use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;

/**
 * Saves a memory and answers its id.
 */
final readonly class SaveMemoryController
{
    public function __invoke(SaveMemoryCall $call, CommandBus $commands): MemoryNamed
    {
        return MemoryNamed::from(['memoryId' => $commands->run(new SaveMemoryCommand($call->text, $call->weight))]);
    }
}
