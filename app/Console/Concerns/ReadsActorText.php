<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Exceptions\InvalidActorText;
use App\Support\ActorReference;

/**
 * The actor a command's option or argument names as text, such as user:01J... or agent:01J....
 */
trait ReadsActorText
{
    /**
     * @throws InvalidActorText
     */
    protected function actorOption(string $name): ActorReference
    {
        return ActorReference::fromText((string) $this->option($name));
    }

    /**
     * @throws InvalidActorText
     */
    protected function actorArgument(string $name): ActorReference
    {
        return ActorReference::fromText((string) $this->argument($name));
    }
}
