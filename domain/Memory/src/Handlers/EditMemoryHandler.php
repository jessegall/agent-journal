<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use App\Contracts\CommandHandler;
use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Exceptions\MemoryInvalid;
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
     */
    public function handle(EditMemory $command): string
    {
        if ($command->text === null && $command->weight === null) {
            throw MemoryInvalid::nothingToChange();
        }

        $memory = Memory::ownForUpdate($command->memoryId);

        if ($command->text !== null) {
            $memory->rewrite($command->text);
        }

        if ($command->weight !== null) {
            $memory->reweigh($command->weight);
        }

        return $memory->id;
    }
}
