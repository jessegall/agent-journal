<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\HoldAccountUsesHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\HeldAccountUses;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;

/**
 * Holds an account's starts for its maintenance, after its owner stopped new starts on it: it answers every start
 * still running on the account, each of which must end before the account's sign-in changes.
 *
 * @extends Command<HeldAccountUses>
 */
#[HandledBy(HoldAccountUsesHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::MaintainAccountUses)]
#[Operation('hold_account_uses', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class HoldAccountUses extends Command implements HasAuthorizationSubject
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
