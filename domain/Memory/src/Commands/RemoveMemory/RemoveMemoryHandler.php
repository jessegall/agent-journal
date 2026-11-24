<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\RemoveMemory;

use App\Exceptions\ModelMissing;
use Domain\Memory\Commands\Support\MemoryCommandHandler;
use Domain\Memory\Models\Memory;

/**
 * Removes one of the actor's own memories; another actor's answers as unavailable.
 */
final readonly class RemoveMemoryHandler extends MemoryCommandHandler
{
    /**
     * @throws ModelMissing
     */
    public function handle(RemoveMemoryCommand $command): string
    {
        $memory = Memory::ownForUpdate($command->memoryId);
        $memory->delete();

        return $memory->id;
    }
}
