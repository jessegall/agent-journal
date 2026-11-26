<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Models\CommandRules\RuleRevision;
use App\Models\Runs\ReaderRevision;
use App\Processes\Declarations\VerificationContract;

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
