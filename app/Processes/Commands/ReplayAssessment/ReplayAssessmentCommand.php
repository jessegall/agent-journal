<?php

declare(strict_types=1);

namespace App\Processes\Commands\ReplayAssessment;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * A user, or the actor who ran it, replays a finished normal part's retained output with the now active approved
 * reader: a new assessment linked to the old one, and a receipt when it is valid. The answer is the receipt id, or
 * empty.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Test)]
final readonly class ReplayAssessmentCommand extends Command
{
    public function __construct(public string $partRunId) {}
}
