<?php

declare(strict_types=1);

namespace App\Core\Hooks\Listeners;

use App\Core\Agents\Events\LaunchStarted;
use App\Core\Hooks\Exceptions\CommandFactsMissing;
use App\Core\Hooks\Inputs\MissingCommandFacts;
use App\Core\Hooks\Inputs\ShellCommandParser;
use App\Core\Hooks\LaunchStacks;
use App\Core\Hooks\States\ReadyStateType;
use App\Core\Hooks\Storage\StackTarget;

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
        if ($this->parser instanceof MissingCommandFacts) {
            throw CommandFactsMissing::forLine();
        }

        $this->stacks->open(new StackTarget($event->agentId, $event->sessionId), ReadyStateType::forKey($event->role));
    }
}
