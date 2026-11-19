<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use BackedEnum;

/**
 * Authorization of another actor than the caller, such as the agent a message asks to answer: the target's own
 * provider decides from its own stored source, and the caller's rights never count.
 */
interface TargetAuthorizer
{
    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function authorize(ActorIdentity $target, string $policy, object|string $subject, BackedEnum $ability): void;

    /**
     * @template TAbility of BackedEnum
     *
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<TAbility>  $abilities
     * @return list<TAbility>
     */
    public function filterActions(
        ActorIdentity $target,
        string $policy,
        object|string $subject,
        array $abilities,
    ): array;
}
