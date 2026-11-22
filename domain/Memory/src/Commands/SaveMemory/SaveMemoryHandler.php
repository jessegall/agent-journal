<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\SaveMemory;

use App\Actors\Support\ActorIdentity;
use Domain\Memory\Commands\Support\MemoryCommandHandler;
use Domain\Memory\Models\Memory;

/**
 * Keeps the memory for the actor who dispatched the command; who owns it never comes from the input.
 */
final readonly class SaveMemoryHandler extends MemoryCommandHandler
{
    public function handle(SaveMemoryCommand $command): string
    {
        return Memory::create(ActorIdentity::of($command->dispatchedBy()), $command->text, $command->weight)->id;
    }
}
