<?php

declare(strict_types=1);

namespace App\Assignments\Console\Concerns;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;

/**
 * The auto-assignment a command names by its actor and type arguments. The start decides who calls, never an option.
 */
trait ReadsAutoAssignmentKey
{
    /**
     * @return array<string, string|int>
     *
     * @throws InvalidActorText
     */
    protected function keyFields(): array
    {
        return [
            ...ActorIdentity::fromText((string) $this->argument('actor'))->asFields('actor'),
            'assignableType' => (string) $this->argument('type'),
        ];
    }
}
