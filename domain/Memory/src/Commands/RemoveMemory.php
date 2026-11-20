<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
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
#[Operation('remove_memory', ResourceAreaType::JournalContent, AccessType::Delete)]
#[Authorize(MemoryPolicy::class, MemoryAbility::Work)]
final readonly class RemoveMemory extends Command implements HasAuthorizationSubject
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
