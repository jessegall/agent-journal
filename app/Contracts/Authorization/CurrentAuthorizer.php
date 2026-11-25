<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Enums\Agents\AccessType;
use App\Exceptions\ActorNotAllowed;

/**
 * Authorization for whoever acts in this request, through the authorizer of its type's provider.
 */
interface CurrentAuthorizer
{
    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function authorize(string $policy, object|string $subject, AccessType $access): void;

    /**
     * The accesses of the list the acting actor may have on the subject, in the order given.
     *
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<AccessType>  $accesses
     * @return list<AccessType>
     */
    public function filterActions(string $policy, object|string $subject, array $accesses): array;
}
