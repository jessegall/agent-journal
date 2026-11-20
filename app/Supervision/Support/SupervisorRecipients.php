<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Support\ActorIdentity;
use App\Profiles\Values\SupervisorTarget;

final readonly class SupervisorRecipients
{
    public function __construct(private SupervisorOwner $owner) {}

    public function resolve(SupervisorTarget $target): ActorIdentity|null
    {
        if ($target->isProfile()) {
            return null;
        }

        if ($target->isOwner()) {
            return $this->owner->resolve()->actor;
        }

        return ActorIdentity::fromText($target->key);
    }
}
