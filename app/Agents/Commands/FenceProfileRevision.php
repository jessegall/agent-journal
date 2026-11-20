<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\FenceProfileRevisionHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Retains the intent to fence every session started from a revoked profile revision, in the transaction that revokes
 * it, so a lost event cannot lose the revocation.
 *
 * @extends Command<string>
 */
#[HandledBy(FenceProfileRevisionHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('fence_profile_revision', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class FenceProfileRevision extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $key,
        public int $revision,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
