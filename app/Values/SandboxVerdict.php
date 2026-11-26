<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Whether Claude Code's own sandbox runs where its tools run, as the isolation probes found, and why not.
 */
final readonly class SandboxVerdict
{
    private function __construct(public bool $isRunnable, public string $why) {}

    public static function runs(): self
    {
        return new self(true, '');
    }

    public static function refused(string $why): self
    {
        return new self(false, $why);
    }
}
