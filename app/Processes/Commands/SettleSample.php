<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\SettleSampleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\SampleOutcome;

/**
 * Judges a request's ended sample run: complete evidence moves the request on to its proof, anything else back to
 * the owner's approval with the attempt kept.
 *
 * @implements Command<SampleOutcome>
 */
#[HandledBy(SettleSampleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class SettleSample implements Command, HasAuthorizationSubject
{
    public function __construct(public string $commandRequestId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
