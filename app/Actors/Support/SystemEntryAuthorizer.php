<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\Policy;
use App\Actors\Exceptions\ActorNotAllowed;
use BackedEnum;

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

    /**
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function authorize(Policy $policy, Actor $actor, object|string $subject, BackedEnum $ability): void
    {
        if (! in_array($policy::class, $this->policies, true)) {
            throw ActorNotAllowed::to($ability, 'record');
        }
    }
}
