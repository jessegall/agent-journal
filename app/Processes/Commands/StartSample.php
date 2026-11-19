<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\StartSampleHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * The permitted actor starts the approved sample of a request once; the same request key returns the same run.
 *
 * @extends Command<string>
 */
#[HandledBy(StartSampleHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class StartSample extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $commandRequestId, public string $permitId, public string $requestKey) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
