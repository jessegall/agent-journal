<?php

declare(strict_types=1);

namespace App\Terminals\Commands\CancelTerminalTake;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;

final readonly class CancelTerminalTakeHandler implements CommandHandler
{
    public function __construct(private TerminalControls $controls) {}

    public function handle(CancelTerminalTakeCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->cancel($command->agentId, $writer, $command->takeId);
    }
}
