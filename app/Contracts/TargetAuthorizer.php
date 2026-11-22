<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\AccessType;
use App\Exceptions\ActorNotAllowed;
use App\Support\ActorIdentity;

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
    public function authorize(ActorIdentity $target, string $policy, object|string $subject, AccessType $access): void;

    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<AccessType>  $accesses
     * @return list<AccessType>
     */
    public function filterActions(
        ActorIdentity $target,
        string $policy,
        object|string $subject,
        array $accesses,
    ): array;
}
