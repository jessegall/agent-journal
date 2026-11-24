<?php

declare(strict_types=1);

namespace App\Support\Execution;

/**
 * The commands of a shell pipeline after their output was pumped between them: the last command's standard output
 * is kept for a substitution.
 */
final readonly class PumpedCommands
{
    public function __construct(public PipedCommands $commands, public string $stdout) {}
}
