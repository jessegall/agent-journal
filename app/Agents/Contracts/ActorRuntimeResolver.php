<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Support\RunningRuntime;
use PhpOption\Option;

/**
 * The one current runtime of an actor, when it runs in any.
 */
interface ActorRuntimeResolver
{
    /**
     * @return Option<RunningRuntime>
     */
    public function currentFor(ActorIdentity $actor): Option;
}
