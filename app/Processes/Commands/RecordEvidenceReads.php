<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\RecordEvidenceReadsHandler;
use App\Processes\Values\EvidenceRange;

/**
 * Records what an output read showed the current actor of one run, one receipt per envelope or byte range.
 *
 * @implements Command<int>
 */
#[HandledBy(RecordEvidenceReadsHandler::class)]
final readonly class RecordEvidenceReads implements Command
{
    /**
     * @param  list<EvidenceRange>  $ranges
     */
    public function __construct(public string $processRunId, public array $ranges) {}
}
