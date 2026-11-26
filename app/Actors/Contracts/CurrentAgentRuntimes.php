<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Agents\Values\RunningRuntime;
use App\Support\ActorReference;
use PhpOption\Option;

/**
 * The runtime an actor runs in now; an actor that runs in no runtime has none.
 */
interface CurrentAgentRuntimes
{
    /**
     * @return Option<RunningRuntime>
     */
    public function currentFor(ActorReference $actor): Option;
}
