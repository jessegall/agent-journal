<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Memory\Handlers\SaveMemoryHandler;

/**
 * Keeps a memory for the calling actor at a weight and answers its id; sent again under the same request key, the
 * bus answers the first id from its receipt.
 *
 * @implements Command<string>
 */
#[HandledBy(SaveMemoryHandler::class)]
final readonly class SaveMemory implements Command
{
    public function __construct(public string $text, public int $weight) {}
}
