<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Programs\Values\ProgramKey;

/**
 * Where the journal keeps each session's delivered skills: a protected folder it owns per session and program, which
 * the program adapter points the launch at. Staged generations live beside it.
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

    public function targetFor(string $sessionId, ProgramKey $program): string
    {
        return "{$this->root}/targets/{$sessionId}/{$program->key}";
    }

    public function generationsFolder(): string
    {
        return "{$this->root}/generations";
    }
}
