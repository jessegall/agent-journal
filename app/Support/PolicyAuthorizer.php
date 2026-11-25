<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\Authorizer;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\RecordPolicy;
use App\Contracts\Reflection\ReflectorFactory;
use App\Data\Profiles\ProfileAuthorization;
use App\Enums\Agents\AccessType;
use Illuminate\Auth\Access\Response;
use Illuminate\Contracts\Auth\Access\Gate;

/**
 * The authorizer of a profile that works through policies: the pair must be available and held, and a record policy
 * then decides on the locked record through Laravel's Gate. A grant-only policy is never built.
 */
final readonly class PolicyAuthorizer implements Authorizer
{
    public function __construct(
        private ProfileAuthorization $grants,
        private PolicyCatalogue $catalogue,
        private Gate $gate,
        private ReflectorFactory $reflectors,
    ) {}

    public function evaluate(string $policy, Actor $actor, object|string $subject, AccessType $access): Response
    {
        $this->catalogue->assertGrantable($policy, $access);

        if (! $this->grants->grants($policy, $access)) {
            return Response::deny("The profile does not grant {$access->value} on {$policy}.");
        }

        if (! $this->reflectors->isSubclassOf($policy, RecordPolicy::class)) {
            return Response::allow();
        }

        return $this->gate->forUser($actor)->inspect('permits', [
            $subject,
            $access,
        ]);
    }
}
