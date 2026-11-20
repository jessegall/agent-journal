<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\RecordEvidenceReadsHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\EvidenceRange;

/**
 * Records what an output read showed the current actor of one run, one receipt per envelope or byte range.
 *
 * @extends Command<int>
 */
#[HandledBy(RecordEvidenceReadsHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
#[Operation('record_evidence_reads', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class RecordEvidenceReads extends Command implements AuthorizedCommand
{
    /**
     * @param  list<EvidenceRange>  $ranges
     */
    public function __construct(public string $processRunId, public array $ranges) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
