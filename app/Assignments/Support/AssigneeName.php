<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Support\ActorIdentity;

/**
 * The name an actor may be shown by to anyone who can see its records: never an email or a credential.
 */
final readonly class AssigneeName
{
    public function __construct(
        public ActorIdentity $actor,
        public string $name,
    ) {}
}
