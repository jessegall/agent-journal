<?php

declare(strict_types=1);

namespace App\Events\Hooks;

/**
 * The tool call an agent's chat line names changed: a new call started, the running one finished, or a new turn
 * cleared it. It is published after the hook commits and causes no page read.
 */
final readonly class RunningToolChanged implements HookEvent
{
    /**
     * @param  string  $changedAt  ISO 8601 in UTC, with microseconds, so the newest change can always be told apart
     */
    public function __construct(
        public string $agentId,
        public string|null $line,
        public bool $isRunning,
        public string $changedAt,
    ) {}
}
