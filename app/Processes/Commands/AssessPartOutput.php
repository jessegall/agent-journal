<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\AssessPartOutputHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * Interprets an ended part's output with the approved reader of its operation, validates it and publishes its result
 * receipt or says why there is none. The answer is the receipt id, or empty when there is no result.
 *
 * @extends Command<string>
 */
#[HandledBy(AssessPartOutputHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class AssessPartOutput extends Command implements HasAuthorizationSubject
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
