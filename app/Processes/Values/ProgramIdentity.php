<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * The program a command names, by its canonical family (git, php, acme) beside the token the agent wrote
 * (/usr/bin/git, php8.3): equivalent spellings share the family, and the original stays for execution and audit.
 */
final readonly class ProgramIdentity
{
    public function __construct(public string $family, public string $original) {}

    public function isSameProgram(self $other): bool
    {
        return $this->family === $other->family;
    }
}
