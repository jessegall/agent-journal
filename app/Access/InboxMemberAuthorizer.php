<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\Authorizer;
use App\Actors\Contracts\Actor;
use App\Agents\Enums\AccessType;
use App\Inboxes\Contracts\InboxMemberPolicies;
use Illuminate\Auth\Access\Response;

/**
 * What an inbox member may do: only what an inbox policy guards; whether it is in the inbox it acts on is the inbox's own
 * check. Tasks, plans, documents, settings, sharing, connections, agents and approvals all refuse it.
 */
final readonly class InboxMemberAuthorizer implements Authorizer
{
    public function __construct(private InboxMemberPolicies $policies) {}

    public function evaluate(string $policy, Actor $actor, object|string $subject, AccessType $access): Response
    {
        if ($this->policies->allows($policy)) {
            return Response::allow();
        }

        return Response::deny('An inbox member may only use the inboxes it is in.');
    }
}
