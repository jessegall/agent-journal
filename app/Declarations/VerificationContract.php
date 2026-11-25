<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Enums\CommandRules\ToolType;
use App\Values\ExecutableBinding;
use App\Values\ExitBranch;
use App\Values\ExitPolicy;
use App\Values\OutputContract;
use App\Values\ProgressPolicy;
use App\Values\ReaderReference;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a test, check or build promises about its run: the operation and the
 * executable it binds, its output contract, its exit policy, its progress policy, its reader and its tool type. A
 * result is published only when a run meets its contract; exits of real tools are added only once proven.
 */
#[MapName(SnakeCaseMapper::class)]
final class VerificationContract extends Data
{
    public function __construct(
        public readonly string $operation,
        public readonly ToolType $tool,
        public readonly ExecutableBinding $binding,
        public readonly OutputContract $output,
        public readonly ExitPolicy $exits,
        public readonly ProgressPolicy $progress,
        public readonly ReaderReference $reader,
    ) {}

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
            ...($exits === [] ? ['no exit code checked yet: every exit counts as a failure'] : $exits),
            $this->reader->label(),
        ];
    }
}
