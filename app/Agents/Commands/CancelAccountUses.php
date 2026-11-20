<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CancelAccountUsesHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;

/**
 * Cancels the starts of a held account that have no process yet, and answers how many it cancelled.
 *
 * @extends Command<int>
 */
#[HandledBy(CancelAccountUsesHandler::class)]
#[Operation('cancel_account_uses', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(AgentPolicy::class, AgentAbility::MaintainAccountUses)]
final readonly class CancelAccountUses extends Command implements HasAuthorizationSubject
{
    public function __construct(public RecordIdentity $account) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
