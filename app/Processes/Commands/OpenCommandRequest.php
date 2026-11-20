<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Handlers\OpenCommandRequestHandler;
use App\Processes\Policies\ProcessPolicy;

/**
 * An agent or a user opens the request that holds a command the journal will not run yet, or gets the open request
 * for the same project, actor, operation and binding back, so a retry makes no second one.
 *
 * @extends Command<string>
 */
#[HandledBy(OpenCommandRequestHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Execute)]
final readonly class OpenCommandRequest extends Command
{
    public function __construct(
        public string $operation,
        public string $bindingDigest,
        public string $line,
        public string $workingFolder,
        public RequestHoldReason $reason,
    ) {}
}
