<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Exceptions\MemoryUnavailable;
use Domain\Memory\Handlers\Support\MemoryCommandHandler;
use Domain\Memory\Models\Memory;

/**
 * Changes one of the actor's own memories; another actor's answers as unavailable.
 */
final readonly class EditMemoryHandler extends MemoryCommandHandler
{
    /**
     * @throws MemoryUnavailable
     * @throws MemoryRevisionChanged
     */
    public function handle(EditMemory $command): string
    {
        $memory = Memory::ownForUpdate($command->memoryId);

        if (! $memory->isAtRevision($command->expectedRevision)) {
            throw MemoryRevisionChanged::for($memory->id, $command->expectedRevision, $memory->revision);
        }
        $memory->revise($command->text, $command->weight);

        return $memory->id;
    }
}
