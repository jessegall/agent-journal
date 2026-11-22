<?php

declare(strict_types=1);

namespace App\Commands\RecordEvidenceReads;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;
use App\Values\EvidenceRange;

/**
 * Records what an output read showed the current actor of one run, one receipt per envelope or byte range.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class RecordEvidenceReadsCommand extends Command
{
    /**
     * @param  list<EvidenceRange>  $ranges
     */
    public function __construct(public string $processRunId, public array $ranges) {}
}
