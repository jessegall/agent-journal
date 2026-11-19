<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActorNotAllowed;
use BackedEnum;

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
    public function authorize(string $policy, object|string $subject, BackedEnum $ability): void;

    /**
     * The abilities of the list the acting actor may do on the subject, in the order given.
     *
     * @template TAbility of BackedEnum
     *
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<TAbility>  $abilities
     * @return list<TAbility>
     */
    public function filterActions(string $policy, object|string $subject, array $abilities): array;
}
