<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Memory\Api\MemoryNamed;
use Domain\Memory\Api\SaveMemoryPayload;
use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;

/**
 * Saves a memory and answers its id.
 */
final readonly class SaveMemoryController
{
    #[Dispatches(SaveMemoryCommand::class)]
    public function __invoke(SaveMemoryPayload $call, CommandBus $commands): MemoryNamed
    {
        return MemoryNamed::from(['memoryId' => $commands->run(new SaveMemoryCommand($call->text, $call->weight))]);
    }
}
