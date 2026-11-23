<?php

declare(strict_types=1);

namespace App\Values;

use App\Declarations\VerificationContract;
use App\Models\CommandRules\RuleRevision;
use App\Models\Runs\ReaderRevision;

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
