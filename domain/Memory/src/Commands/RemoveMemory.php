<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Memory\Handlers\RemoveMemoryHandler;

/**
 * Removes one of the calling actor's memories and answers its id.
 *
 * @implements Command<string>
 */
#[HandledBy(RemoveMemoryHandler::class)]
final readonly class RemoveMemory implements Command
{
    public function __construct(public string $memoryId) {}
}
