<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Memory\Handlers\RememberForAgentHandler;

/**
 * Keeps a memory for an agent at a weight and answers its id; the memory takes the journal's next memory number.
 *
 * @implements Command<string>
 */
#[HandledBy(RememberForAgentHandler::class)]
final readonly class RememberForAgent implements Command
{
    public function __construct(public string $agentId, public string $text, public int $weight) {}
}
