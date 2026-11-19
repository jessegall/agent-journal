<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Handlers\OpenCommandRequestHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * An agent or a user opens the request that holds a command the journal will not run yet, or gets the open request
 * for the same project, actor, operation and binding back, so a retry makes no second one.
 *
 * @extends Command<string>
 */
#[HandledBy(OpenCommandRequestHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
final readonly class OpenCommandRequest extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $operation,
        public string $bindingDigest,
        public string $line,
        public string $workingFolder,
        public RequestHoldReason $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
