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
        return $this->actorOf($this->option($name), "--{$name}");
    }

    /**
     * @throws InvalidActorText
     */
    protected function actorArgument(string $name): ActorReference
    {
        return $this->actorOf($this->argument($name), $name);
    }

    /**
     * @throws InvalidActorText
     */
    private function actorOf(mixed $text, string $name): ActorReference
    {
        if (! is_string($text)) {
            throw InvalidActorText::missing($name);
        }

        return ActorReference::fromText($text);
    }
}
