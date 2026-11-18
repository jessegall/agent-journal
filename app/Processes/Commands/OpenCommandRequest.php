<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Handlers\OpenCommandRequestHandler;

/**
 * An agent or a user opens the request that holds a command the journal will not run yet, or gets the open request
 * for the same project, actor, operation and binding back, so a retry makes no second one.
 *
 * @implements Command<string>
 */
#[HandledBy(OpenCommandRequestHandler::class)]
final readonly class OpenCommandRequest implements Command
{
    public function __construct(
        public string $operation,
        public string $bindingDigest,
        public string $line,
        public string $workingFolder,
        public RequestHoldReason $reason,
    ) {}
}
