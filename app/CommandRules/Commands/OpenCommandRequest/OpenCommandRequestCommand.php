<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\OpenCommandRequest;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Enums\RequestHoldReason;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * An agent or a user opens the request that holds a command the journal will not run yet, or gets the open request
 * for the same project, actor, operation and binding back, so a retry makes no second one.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Execute)]
final readonly class OpenCommandRequestCommand extends Command
{
    public function __construct(
        public string $operation,
        public string $bindingDigest,
        public string $line,
        public string $workingFolder,
        public RequestHoldReason $reason,
    ) {}
}
