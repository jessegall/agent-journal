<?php

declare(strict_types=1);

namespace App\Core\Hooks\Listeners;

use App\Core\Agents\Events\LaunchStarted;
use App\Core\Hooks\Actions\LaunchStacks;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Exceptions\ShellParserMissing;
use App\Core\Hooks\Inputs\MissingShellParser;
use App\Core\Hooks\States\Support\ReadyStateType;
use App\Core\Hooks\Support\StackTarget;

/**
 * Opens the launched agent's stack with the bottom state of its role, in the launch transaction. A launch with an
 * unknown role, or with no parser to read its shell commands, is refused before the program starts.
 */
final readonly class OpenLaunchStack
{
    public function __construct(
        private LaunchStacks $stacks,
        private ShellCommandParser $parser,
    ) {}

    public function handle(LaunchStarted $event): void
    {
        if ($this->parser instanceof MissingShellParser) {
            throw ShellParserMissing::forLine();
        }

        $this->stacks->open(new StackTarget($event->agentId, $event->sessionId), ReadyStateType::forKey($event->role));
    }
}
