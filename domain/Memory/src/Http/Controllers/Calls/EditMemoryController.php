<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Memory\Calls\EditMemoryCall;
use Domain\Memory\Calls\MemoryNamed;
use Domain\Memory\Commands\EditMemory\EditMemoryCommand;

/**
 * Edits a memory.
 */
final readonly class EditMemoryController
{
    public function __invoke(EditMemoryCall $call, CommandBus $commands): MemoryNamed
    {
        $command = new EditMemoryCommand($call->memoryId, $call->revision, $call->text, $call->weight);

        return MemoryNamed::from(['memoryId' => $commands->run($command)]);
    }
}
