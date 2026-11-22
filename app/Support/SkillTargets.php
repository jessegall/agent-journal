<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\DriverKey;

/**
 * Where the journal keeps each session's delivered skills: a protected folder it owns per session and driver, which
 * the driver adapter points the start at. Staged generations live beside it.
 */
final readonly class SkillTargets
{
    public function __construct(
        private string $root,
    ) {}

    public function root(): string
    {
        return $this->root;
    }

    public function targetFor(string $sessionId, DriverKey $driver): string
    {
        return "{$this->root}/targets/{$sessionId}/{$driver->key}";
    }

    public function generationsFolder(): string
    {
        return "{$this->root}/generations";
    }
}
