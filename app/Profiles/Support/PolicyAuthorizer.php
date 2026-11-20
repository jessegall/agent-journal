<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Profiles\Values\ProfileAuthorization;
use BackedEnum;

/**
 * The authorizer of a profile that works through policies: the profile must grant the policy's ability, and then the
 * policy decides for this actor and subject.
 */
final readonly class PolicyAuthorizer implements Authorizer
{
    public function __construct(private ProfileAuthorization $grants, private PolicyCatalogue $catalogue) {}

    /**
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     * @throws AbilityNotRegistered
     */
    public function authorize(Policy $policy, Actor $actor, object|string $subject, BackedEnum $ability): void
    {
        $this->catalogue->requireGrantable($policy::class, $ability);
        $this->grants->assertGranted($policy::class, $ability);
        $decide = [$policy, 'authorize'];

        if (! is_callable($decide)) {
            throw ActorNotAllowed::to($ability, 'record');
        }

        $decide($actor, $subject, $ability);
    }
}
