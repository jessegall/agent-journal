<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Declarations\VerificationContract;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\RuleRevision;

/**
 * The active approved declaration of an operation with its verification contract and the proven reader it was
 * approved with.
 */
final readonly class ApprovedPair
{
    public function __construct(
        public RuleRevision $declaration,
        public VerificationContract $contract,
        public ReaderRevision $reader,
    ) {}
}
