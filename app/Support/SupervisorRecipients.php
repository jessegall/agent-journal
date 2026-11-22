<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Agent;
use App\Values\SupervisorTarget;
use PhpOption\Option;
use PhpOption\Some;

final readonly class SupervisorRecipients
{
    public function __construct(private SupervisorOwner $owner) {}

    /**
     * The actor the target names when one exists and the target resolves uniquely.
     *
     * @return Option<ActorIdentity>
     */
    public function resolve(SupervisorTarget $target): Option
    {
        if ($target->isProfile()) {
            return Agent::soleActorForProfile($target->profileKey()->key);
        }

        if ($target->isOwner()) {
            return Option::fromValue($this->owner->resolve()->actor);
        }

        return new Some(ActorIdentity::fromText($target->key));
    }
}
