<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CancelAccountUsesHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Records\Support\RecordIdentity;

/**
 * Cancels the launches of a held account that have no process yet, and answers how many it cancelled.
 *
 * @implements Command<int>
 */
#[HandledBy(CancelAccountUsesHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::MaintainAccountUses)]
final readonly class CancelAccountUses implements Command, HasAuthorizationSubject
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
