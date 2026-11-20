<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\ReplayAssessmentHandler;
use App\Processes\Policies\ProcessPolicy;

/**
 * A user, or the actor who ran it, replays a finished normal part's retained output with the now active approved
 * reader: a new assessment linked to the old one, and a receipt when it is valid. The answer is the receipt id, or
 * empty.
 *
 * @extends Command<string>
 */
#[HandledBy(ReplayAssessmentHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Test)]
final readonly class ReplayAssessment extends Command
{
    public function __construct(public string $partRunId) {}
}
