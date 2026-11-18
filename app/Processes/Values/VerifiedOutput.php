<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RuleRevision;

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
