<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use App\Contracts\CommandHandler;
use Domain\Memory\Commands\RemoveMemory;
use Domain\Memory\Exceptions\MemoryUnavailable;
use Domain\Memory\Models\Memory;

/**
 * Removes one of the actor's own memories; another actor's answers as unavailable.
 */
final readonly class RemoveMemoryHandler implements CommandHandler
{
    /**
     * @throws MemoryUnavailable
     */
    public function handle(RemoveMemory $command): string
    {
        $memory = Memory::ownForUpdate($command->memoryId);
        $memory->delete();

        return $memory->id;
    }
}
