<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Memory\Api\EditMemoryPayload;
use Domain\Memory\Api\MemoryNamed;
use Domain\Memory\Commands\EditMemory\EditMemoryCommand;

/**
 * Edits a memory.
 */
final readonly class EditMemoryController
{
    #[Dispatches(EditMemoryCommand::class)]
    public function __invoke(EditMemoryPayload $call, CommandBus $commands): MemoryNamed
    {
        $command = new EditMemoryCommand($call->memoryId, $call->revision, $call->text, $call->weight);

        return MemoryNamed::from(['memoryId' => $commands->run($command)]);
    }
}
