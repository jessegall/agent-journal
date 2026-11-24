<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Values\ExecutionContext;

/**
 * A builtin that ran: its status, the context it leaves and what it printed.
 */
final readonly class BuiltinEnded
{
    public function __construct(
        public BuiltinCall $call,
        public StepStatus $status,
        public ExecutionContext $context,
        public string $stdout,
        public string $stderr,
    ) {}
}
