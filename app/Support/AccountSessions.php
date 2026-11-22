<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\IdentityLinks;
use App\Models\AgentSession;

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
}
