<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\ReplayAssessmentHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A user, or the actor who ran it, replays a finished normal part's retained output with the now active approved
 * reader: a new assessment linked to the old one, and a receipt when it is valid. The answer is the receipt id, or
 * empty.
 *
 * @extends Command<string>
 */
#[HandledBy(ReplayAssessmentHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class ReplayAssessment extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $partRunId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
