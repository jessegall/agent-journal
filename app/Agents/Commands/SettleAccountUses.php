<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\SettleAccountUsesHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;

/**
 * Confirms that every start of a held account has ended, so its owner may change the account's sign-in; it is
 * refused while one still runs.
 *
 * @extends Command<null>
 */
#[HandledBy(SettleAccountUsesHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::MaintainAccountUses)]
#[Operation('settle_account_uses', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class SettleAccountUses extends Command implements HasAuthorizationSubject
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
