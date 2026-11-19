<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Models\AgentSession;
use App\Records\Contracts\IdentityLinks;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Builder;

/**
 * The journal sessions that ran with an account, found through the link each session keeps to it.
 */
final readonly class AccountSessions
{
    public function __construct(private IdentityLinks $links) {}

    /**
     * @return Builder<AgentSession>
     */
    public function all(RecordIdentity $account): Builder
    {
        return $this->links->among(AgentSession::query(), $account);
    }

    /**
     * @return Builder<AgentSession>
     */
    public function running(RecordIdentity $account): Builder
    {
        return $this->links->among(AgentSession::query()->running(), $account);
    }
}
