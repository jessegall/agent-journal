<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\FenceProfileRevisionHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Retains the intent to fence every session started from a revoked configuration revision, named by an opaque
 * reference, in the transaction that revokes it, so a lost event cannot lose the revocation.
 *
 * @extends Command<string>
 */
#[HandledBy(FenceProfileRevisionHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('fence_profile_revision', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class FenceProfileRevision extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $revisionReference) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
