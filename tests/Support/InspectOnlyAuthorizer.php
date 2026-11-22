<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Agents\Policies\AgentTerminalControlPolicy;
use App\Operations\Enums\AccessType;

/**
 * An authorizer that lets the actor inspect anything and control nothing, as an inspect-only grant does.
 */
final class InspectOnlyAuthorizer implements CurrentAuthorizer
{
    public function authorize(string $policy, object|string $subject, AccessType $access): void
    {
        if ($policy === AgentTerminalControlPolicy::class) {
            throw ActorNotAllowed::to($access, 'agent');
        }
    }

    /**
     * @param  list<AccessType>  $accesses
     * @return list<AccessType>
     */
    public function filterActions(string $policy, object|string $subject, array $accesses): array
    {
        return $policy === AgentTerminalControlPolicy::class ? [] : $accesses;
    }
}
