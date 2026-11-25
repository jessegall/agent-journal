<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Enums\CommandRules\BuiltinCommand;
use App\Values\ExecutionContext;

/**
 * A builtin about to run in its part: which builtin, its arguments and the context it changes.
 */
final readonly class BuiltinCall
{
    /**
     * @param  list<string>  $arguments
     */
    public function __construct(
        public QueuedPart $queued,
        public BuiltinCommand $command,
        public array $arguments,
    ) {}

    public function context(): ExecutionContext
    {
        return $this->queued->context;
    }

    public function ended(
        StepStatus $status,
        ExecutionContext $context,
        string $stdout = '',
        string $stderr = '',
    ): BuiltinEnded {
        return new BuiltinEnded($this, $status, $context, $stdout, $stderr);
    }
}
