<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Exceptions\InvalidActorText;
use App\Support\ActorReference;

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
            ...ActorReference::fromText((string) $this->argument('actor'))->asFields('actor'),
            'assignableType' => (string) $this->argument('type'),
        ];
    }
}
