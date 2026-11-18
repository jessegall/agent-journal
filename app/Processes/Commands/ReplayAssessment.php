<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ReplayAssessmentHandler;

/**
 * A user, or the actor who ran it, replays a finished normal part's retained output with the now active approved
 * reader: a new assessment linked to the old one, and a receipt when it is valid. The answer is the receipt id, or
 * empty.
 *
 * @implements Command<string>
 */
#[HandledBy(ReplayAssessmentHandler::class)]
final readonly class ReplayAssessment implements Command
{
    public function __construct(public string $partRunId) {}
}
