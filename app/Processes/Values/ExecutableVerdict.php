<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * Whether the executable a command would run is the one its binding trusts; a refusal keeps the canonical name and
 * the path that did not match, none when the
 * program resolves nowhere.
 */
final readonly class ExecutableVerdict
{
    public function __construct(
        public bool $isTrusted,
        public ProgramIdentity $program,
        public string|null $resolvedPath,
        public string $reason,
    ) {}
}
