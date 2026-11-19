<?php

declare(strict_types=1);

namespace App\Agents\Resolvers\Support;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Agents\Support\RunningRuntime;
use PhpOption\None;
use PhpOption\Option;

/**
 * Resolves the full actor identity first and asks the actor for its current runtime; an actor that runs in no
 * runtime has none.
 */
final readonly class CurrentAgentRuntimes
{
    public function __construct(private ActorResolver $actors) {}

    /**
     * @return Option<RunningRuntime>
     */
    public function currentFor(ActorIdentity $actor): Option
    {
        $resolved = $this->actors->get($actor);

        return $resolved instanceof Agent ? $resolved->currentRuntime() : None::create();
    }
}
