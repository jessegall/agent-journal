<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Values\ExecutionContext;

/**
 * What a builtin did: its status, the shell context after it, and what it wrote to its standard output and error.
 */
final readonly class BuiltinResult
{
    public function __construct(
        public int $status,
        public ExecutionContext $context,
        public string $stdout = '',
        public string $stderr = '',
    ) {}
}
