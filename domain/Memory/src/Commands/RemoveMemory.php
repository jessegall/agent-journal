<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Memory\Enums\MemoryAbility;
use Domain\Memory\Handlers\RemoveMemoryHandler;
use Domain\Memory\Models\Memory;
use Domain\Memory\Policies\MemoryPolicy;

/**
 * Removes one of the calling actor's memories and answers its id.
 *
 * @extends Command<string>
 */
#[HandledBy(RemoveMemoryHandler::class)]
#[Authorize(MemoryPolicy::class, MemoryAbility::Work)]
#[Operation('remove_memory', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class RemoveMemory extends Command implements AuthorizedCommand
{
    public function __construct(public string $memoryId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Memory::class;
    }
}
