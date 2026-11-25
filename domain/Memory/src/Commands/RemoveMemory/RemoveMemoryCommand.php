<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\RemoveMemory;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Memory\Policies\MemoryPolicy;

/**
 * Removes one of the calling actor's memories and answers its id.
 *
 * @extends Command<string>
 */
#[Authorize(MemoryPolicy::class, AccessType::Edit)]
final readonly class RemoveMemoryCommand extends Command
{
    public function __construct(public string $memoryId) {}
}
