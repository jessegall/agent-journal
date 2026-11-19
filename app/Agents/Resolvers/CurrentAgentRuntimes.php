<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\ActorRuntimeResolver;
use App\Agents\Contracts\RunsRuntimes;
use PhpOption\None;
use PhpOption\Option;

/**
 * Resolves the full actor identity first and asks the actor for its current runtime; an actor that runs in no
 * runtime has none.
 */
final readonly class CurrentAgentRuntimes implements ActorRuntimeResolver
{
    public function __construct(private ActorResolver $actors) {}

    public function currentFor(ActorIdentity $actor): Option
    {
        $resolved = $this->actors->get($actor);

        return $resolved instanceof RunsRuntimes ? $resolved->currentRuntime() : None::create();
    }
}
