<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Memory\Commands\SaveMemory;
use Domain\Memory\Handlers\Support\MemoryCommandHandler;
use Domain\Memory\Models\Memory;

/**
 * Keeps the memory for the actor who dispatched the command; who owns it never comes from the input.
 */
final readonly class SaveMemoryHandler extends MemoryCommandHandler
{
    public function handle(SaveMemory $command): string
    {
        return Memory::keep(ActorIdentity::of($command->dispatchedBy()), $command->text, $command->weight)->id;
    }
}
