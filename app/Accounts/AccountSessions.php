<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Actors\Contracts\IdentityLinks;
use App\Models\Agents\AgentSession;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;

/**
 * The journal sessions that ran with an account, found through the link each session keeps to it.
 */
final readonly class AccountSessions
{
    public function __construct(private IdentityLinks $links) {}

    /**
     * @return ReadBuilder<AgentSession>
     */
    public function all(RecordIdentity $account): ReadBuilder
    {
        return $this->links->among(AgentSession::query(), $account);
    }

    /** @param list<RecordIdentity> $accounts */
    public function histories(array $accounts, int $limit): AccountUseHistories
    {
        return new AccountUseHistories(AgentSession::recentUsesOf($accounts, $limit));
    }
}
