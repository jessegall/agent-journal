<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RetryDriverRequestHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A person sends a failed or unavailable driver request again, as a new attempt under its own key; the
 * request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(RetryDriverRequestHandler::class)]
#[Operation('retry_driver_request', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class RetryDriverRequest extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
