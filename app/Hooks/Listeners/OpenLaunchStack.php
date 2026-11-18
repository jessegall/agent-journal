<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\LaunchStarted;
use App\Agents\Support\StackTarget;
use App\Contracts\Listener;
use App\Hooks\Actions\LaunchStacks;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Exceptions\ShellParserMissing;
use App\Hooks\Inputs\MissingShellParser;
use App\Processes\Contracts\ShellCommandParser;

/**
 * Opens the launched agent's stack with the bottom state of its role, in the launch transaction. A launch with an
 * unknown role, or with no parser to read its shell commands, is refused before the program starts.
 */
final readonly class OpenLaunchStack implements Listener
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
