<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The artisan commands that open and close their own read measurements, one per unit of work, so the command as a
 * whole keeps none open.
 */
final class SelfMeasuredCommands
{
    /**
     * @var list<string>
     */
    private array $commands = [];

    public function add(string $command): void
    {
        if ($this->has($command)) {
            return;
        }

        $this->commands[] = $command;
    }

    public function has(string|null $command): bool
    {
        return in_array($command, $this->commands, true);
    }

    /**
     * @return list<string>
     */
    public function all(): array
    {
        return $this->commands;
    }
}
