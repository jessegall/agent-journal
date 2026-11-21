<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\ReservedCommands;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\Command;
use App\Hooks\Commands\FocusInstruction;

/**
 * A handler that builds a reserved command through a private helper, which the reserved commands check refuses.
 */
final readonly class BuildsThroughAHelper
{
    public function __construct(private CommandBus $commands) {}

    public function handle(): void
    {
        $this->commands->run($this->focus());
    }

    /**
     * @return Command<null>
     */
    private function focus(): Command
    {
        return new FocusInstruction();
    }
}
