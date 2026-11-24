<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\EditMemory;

use App\Exceptions\ModelMissing;
use Domain\Memory\Commands\Support\MemoryCommandHandler;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Models\Memory;

/**
 * Changes one of the actor's own memories; another actor's answers as unavailable.
 */
final readonly class EditMemoryHandler extends MemoryCommandHandler
{
    /**
     * @throws ModelMissing
     * @throws MemoryRevisionChanged
     */
    public function handle(EditMemoryCommand $command): string
    {
        $memory = Memory::ownForUpdate($command->memoryId);

        if (! $memory->isAtRevision($command->expectedRevision)) {
            throw MemoryRevisionChanged::for($memory->id, $command->expectedRevision, $memory->revision);
        }

        $memory->revise($command->text, $command->weight);

        return $memory->id;
    }
}
