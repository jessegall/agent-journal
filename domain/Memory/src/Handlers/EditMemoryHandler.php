<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use App\Contracts\CommandHandler;
use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Exceptions\MemoryInvalid;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Exceptions\MemoryUnavailable;
use Domain\Memory\Models\Memory;

/**
 * Changes one of the actor's own memories; another actor's answers as unavailable.
 */
final readonly class EditMemoryHandler implements CommandHandler
{
    /**
     * @throws MemoryUnavailable
     * @throws MemoryInvalid
     * @throws MemoryRevisionChanged
     */
    public function handle(EditMemory $command): string
    {
        $memory = Memory::ownForUpdate($command->memoryId);
        $memory->requireRevision($command->expectedRevision);
        $memory->revise($command->text, $command->weight);

        return $memory->id;
    }
}
