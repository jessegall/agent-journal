<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\Authorizer;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Enums\Agents\AccessType;
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
