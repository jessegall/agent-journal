<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Memory\Handlers\EditMemoryHandler;

/**
 * Rewrites the text, the weight or both of one of the calling actor's memories at the revision the caller read, and
 * answers its id.
 *
 * @implements Command<string>
 */
#[HandledBy(EditMemoryHandler::class)]
final readonly class EditMemory implements Command
{
    public function __construct(public string $memoryId, public int $expectedRevision, public string|null $text, public int|null $weight) {}
}
