<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Enums\Outcome;
use App\Processes\Exceptions\VerificationContractInvalid;
use App\Processes\Values\ExitBranch;
use Spatie\LaravelData\Data;

/**
 * One exit status of a check with its meaning and evidence, as a stored contract holds it.
 */
final class StoredExitBranch extends Data
{
    public function __construct(
        public readonly int $status,
        public readonly Outcome $outcome,
        public readonly string $requires,
    ) {}

    public static function fromExitBranch(ExitBranch $branch): self
    {
        return new self($branch->status, $branch->outcome, $branch->requires);
    }

    /**
     * @throws VerificationContractInvalid
     */
    public function toExitBranch(): ExitBranch
    {
        return ExitBranch::of($this->status, $this->outcome, $this->requires);
    }
}
