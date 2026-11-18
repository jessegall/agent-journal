<?php

declare(strict_types=1);

namespace Domain\Memory\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use Domain\Memory\Commands\SaveMemory;
use Domain\Memory\Exceptions\MemoryInvalid;
use Domain\Memory\Models\Memory;

/**
 * Keeps the memory for the actor of this request; who owns it never comes from the input.
 */
final readonly class SaveMemoryHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws MemoryInvalid
     */
    public function handle(SaveMemory $command): string
    {
        return Memory::keep(ActorIdentity::of($this->actors->actor()), $command->text, $command->weight)->id;
    }
}
