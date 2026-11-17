<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Listeners;

use App\Domain\Agents\Events\LaunchStarted;
use App\Domain\Hooks\Inputs\CommandFactsMissing;
use App\Domain\Hooks\Inputs\MissingCommandFacts;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\LaunchStacks;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\Storage\StackTarget;

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
