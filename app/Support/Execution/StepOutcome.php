<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Processes\Execution\StepStatus;
use App\Values\ExecutionContext;

/**
 * What one executed step leaves for the steps after it: the status a branch decides on, the shell context, and the
 * standard output it produced, which a command substitution uses as its value.
 */
final readonly class StepOutcome
{
    /**
     * The most standard output a step keeps in memory as a substitution value; the recorder keeps every byte.
     */
    public const int KEPT_OUTPUT_BYTE_LIMIT = 1_048_576;

    public function __construct(
        public StepStatus $status,
        public ExecutionContext $context,
        public string $output = '',
    ) {}

    /**
     * The outcome as ! reports it: only the branch decision flips, never the stored exit of the part.
     */
    public function negated(): self
    {
        return new self($this->status->negated(), $this->context, $this->output);
    }

    public function withContext(ExecutionContext $context): self
    {
        return new self($this->status, $context, $this->output);
    }

    /**
     * This outcome followed by the next step's: the next status and context, both outputs.
     */
    public function then(self $next): self
    {
        return new self($next->status, $next->context, $this->output.$next->output);
    }
}
