<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Contracts\Actor;
use App\Contracts\Authorizer;
use App\Contracts\ChatMemberPolicies;
use App\Enums\AccessType;
use Illuminate\Auth\Access\Response;

/**
 * What a chat member may do: only what a chat policy guards; whether it is in the chat it acts on is the chat's own
 * check. Tasks, plans, documents, settings, sharing, connections, agents and approvals all refuse it.
 */
final readonly class ChatMemberAuthorizer implements Authorizer
{
    public function __construct(private ChatMemberPolicies $policies) {}

    public function evaluate(string $policy, Actor $actor, object|string $subject, AccessType $access): Response
    {
        return $this->policies->allows($policy)
            ? Response::allow()
            : Response::deny('A chat member may only use the chats it is in.');
    }
}
