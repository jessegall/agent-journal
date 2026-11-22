<?php

declare(strict_types=1);

namespace App\Values;

use App\Models\OutputAssessment;
use App\Models\PartRun;
use App\Models\ProcessRun;
use App\Models\RuleRevision;

/**
 * A part's output the EvidenceValidator found valid against its approved pair: only the validator issues it, and the
 * publisher still re-reads the stored assessment before it writes a receipt from it. Holding one is not authority.
 */
final readonly class VerifiedOutput
{
    /**
     * @internal issued by EvidenceValidator::verify only
     */
    public function __construct(
        public ProcessRun $run,
        public PartRun $part,
        public RuleRevision $declaration,
        public OutputAssessment $assessment,
        public string $manifestDigest,
    ) {}
}
