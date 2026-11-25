<?php

declare(strict_types=1);

namespace App\Commands\Terminals\ReleaseTerminalControl;

use App\Contracts\Bus\CommandHandler;
use App\Support\ActorReference;
use App\Support\TerminalControls;

final readonly class ReleaseTerminalControlHandler implements CommandHandler
{
    public function __construct(private TerminalControls $controls) {}

    public function handle(ReleaseTerminalControlCommand $command): string
    {
        $writer = ActorReference::of($command->dispatchedBy());

        return $this->controls->release($command->agentId, $writer, $command->grantId);
    }
}
