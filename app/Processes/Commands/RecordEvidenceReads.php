<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\RecordEvidenceReadsHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\EvidenceRange;

/**
 * Records what an output read showed the current actor of one run, one receipt per envelope or byte range.
 *
 * @implements Command<int>
 */
#[HandledBy(RecordEvidenceReadsHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class RecordEvidenceReads implements Command, HasAuthorizationSubject
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
