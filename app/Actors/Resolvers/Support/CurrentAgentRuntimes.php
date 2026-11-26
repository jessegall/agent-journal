<?php

declare(strict_types=1);

namespace App\Actors\Resolvers\Support;

use App\Actors\Contracts\ActorResolver;
use App\Agents\Values\RunningRuntime;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
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
    public function currentFor(ActorReference $actor): Option
    {
        $resolved = $this->actors->get($actor);

        if ($resolved instanceof Agent) {
            return $resolved->currentRuntime();
        }

        return None::create();
    }
}
