<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Actors\Support\ActorIdentity;

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
