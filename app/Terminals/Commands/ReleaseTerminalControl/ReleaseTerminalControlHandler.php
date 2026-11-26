<?php

declare(strict_types=1);

namespace App\Terminals\Commands\ReleaseTerminalControl;

use App\Bus\Contracts\CommandHandler;
use App\Terminals\TerminalControls;

final readonly class ReleaseTerminalControlHandler implements CommandHandler
{
    public function __construct(private TerminalControls $controls) {}

    public function handle(ReleaseTerminalControlCommand $command): string
    {
        $writer = $command->dispatchedBy();

        return $this->controls->release($command->agentId, $writer, $command->grantId);
    }
}
