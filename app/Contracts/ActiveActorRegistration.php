<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\ActiveActorCounterRepeated;

/**
 * Where the owner of a kind of actor registers its counter of present ones; one counter per actor type.
 */
interface ActiveActorRegistration
{
    /**
     * @param  class-string<ActiveActorCounter>  $counterClass
     *
     * @throws ActiveActorCounterRepeated
     */
    public function register(string $counterClass): void;
}
