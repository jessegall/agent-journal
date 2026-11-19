<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\ToolType;
use App\Processes\Exceptions\VerificationContractInvalid;
use App\Processes\Values\ExitBranch;
use App\Processes\Values\ExitPolicy;
use App\Processes\Values\ReaderReference;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a test, check or build promises about its run, as a stored rule holds it: the exits as a list and the reader
 * as its revision, empty while no reader is proven.
 */
final class StoredVerificationContract extends Data
{
    /**
     * @param  list<StoredExitBranch>  $exits
     */
    public function __construct(
        public readonly string $operation,
        public readonly ToolType $tool,
        public readonly StoredExecutableBinding $binding,
        public readonly StoredOutputContract $output,
        #[DataCollectionOf(StoredExitBranch::class)]
        public readonly array $exits,
        public readonly StoredProgressPolicy $progress,
        public readonly string $reader,
    ) {}

    public static function fromContract(VerificationContract $contract): self
    {
        return self::from([
            'operation' => $contract->operation,
            'tool' => $contract->tool,
            'binding' => StoredExecutableBinding::fromBinding($contract->binding),
            'output' => StoredOutputContract::fromOutputContract($contract->output),
            'exits' => $contract->exits->branches,
            'progress' => StoredProgressPolicy::fromProgressPolicy($contract->progress),
            'reader' => $contract->reader->revision,
        ]);
    }

    /**
     * @throws VerificationContractInvalid
     */
    public function toContract(): VerificationContract
    {
        return new VerificationContract(
            $this->operation,
            $this->tool,
            $this->binding->toBinding(),
            $this->output->toOutputContract(),
            ExitPolicy::of(...array_map(
                fn (StoredExitBranch $branch): ExitBranch => $branch->toExitBranch(),
                $this->exits,
            )),
            $this->progress->toProgressPolicy(),
            ReaderReference::stored($this->reader),
        );
    }
}
