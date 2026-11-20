<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\RecordEvidenceReadsHandler;
use App\Processes\Policies\ProcessPolicy;
use App\Processes\Values\EvidenceRange;

/**
 * Records what an output read showed the current actor of one run, one receipt per envelope or byte range.
 *
 * @extends Command<int>
 */
#[HandledBy(RecordEvidenceReadsHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class RecordEvidenceReads extends Command
{
    /**
     * @param  list<EvidenceRange>  $ranges
     */
    public function __construct(public string $processRunId, public array $ranges) {}
}
