<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\Authorizer;
use App\Contracts\Authorization\Policy;
use App\Enums\Agents\AccessType;
use Illuminate\Auth\Access\Response;

/**
 * The authorizer of one trusted entry of the journal itself: it may act only on the subjects of the policies its
 * entry is registered for, so the host's grant never reaches a share and the publisher's never reaches a host.
 */
final readonly class SystemEntryAuthorizer implements Authorizer
{
    /**
     * @param  list<class-string<Policy>>  $policies
     */
    public function __construct(private array $policies) {}

    public function evaluate(string $policy, Actor $actor, object|string $subject, AccessType $access): Response
    {
        if (in_array($policy, $this->policies, true)) {
            return Response::allow();
        }

        return Response::deny("This trusted entry acts under no {$policy}.");
    }
}
