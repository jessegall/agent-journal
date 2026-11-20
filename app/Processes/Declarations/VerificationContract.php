<?php

declare(strict_types=1);

namespace App\Processes\Declarations;

use App\Processes\Enums\ToolType;
use App\Processes\Exceptions\VerificationContractInvalid;
use App\Processes\Stored\StoredVerificationContract;
use App\Processes\Values\ExecutableBinding;
use App\Processes\Values\ExitBranch;
use App\Processes\Values\ExitPolicy;
use App\Processes\Values\OutputContract;
use App\Processes\Values\ProgressPolicy;
use App\Processes\Values\ReaderReference;

/**
 * What a test, check or build promises about its run (doc 21 revision 6, sections 68 and 72): the operation and the
 * executable it binds, its output contract, its exit policy, its progress policy, its reader and its tool type. A
 * result is published only when a run meets its contract; exits of real tools are added only once proven.
 */
final readonly class VerificationContract
{
    public function __construct(
        public string $operation,
        public ToolType $tool,
        public ExecutableBinding $binding,
        public OutputContract $output,
        public ExitPolicy $exits,
        public ProgressPolicy $progress,
        public ReaderReference $reader,
    ) {}

    /**
     * The contract as a stored rule holds it.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return StoredVerificationContract::fromContract($this)->toArray();
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     *
     * @throws VerificationContractInvalid
     */
    public static function fromArray(array $fields): self
    {
        return StoredVerificationContract::from($fields)->toContract();
    }

    /**
     * The digest of what the contract promises, apart from which reader reads it: a repaired reader keeps the digest.
     */
    public function digest(): string
    {
        $promised = array_diff_key($this->toArray(), ['reader' => true]);

        return hash('sha256', json_encode($promised, JSON_THROW_ON_ERROR));
    }

    /**
     * The contract of a declared check whose reader and exits are not proven yet: plain lines, every exit an execution
     * error, no total, and a reader required before it may run normally.
     */
    public static function unproven(string $operation, ToolType $tool, ExecutableBinding $binding): self
    {
        return new self(
            $operation,
            $tool,
            $binding,
            OutputContract::plainLines(),
            ExitPolicy::unproven(),
            ProgressPolicy::indeterminate(),
            ReaderReference::required(),
        );
    }

    /**
     * The contract as lines a user reads in an explanation.
     *
     * @return list<string>
     */
    public function description(): array
    {
        $exits = array_map(
            fn (ExitBranch $branch): string => sprintf(
                'exit %s: %s when %s',
                $branch->status,
                $branch->outcome->value,
                $branch->requires,
            ),
            $this->exits->branches,
        );

        return [
            "tool {$this->tool->value}",
            $this->output->label(),
            "progress {$this->progress->type->value}",
            ...($exits === [] ? ['exits not proven: every status is an execution error'] : $exits),
            $this->reader->label(),
        ];
    }
}
