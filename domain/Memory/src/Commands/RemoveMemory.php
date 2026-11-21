<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Memory\Policies\MemoryPolicy;

/**
 * Removes one of the calling actor's memories and answers its id.
 *
 * @extends Command<string>
 */
#[Authorize(MemoryPolicy::class, AccessType::Edit)]
final readonly class RemoveMemory extends Command
{
    public function __construct(public string $memoryId) {}
}
