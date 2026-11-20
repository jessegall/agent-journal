<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Support\ActorIdentity;
use App\Profiles\Values\SupervisorTarget;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

final readonly class SupervisorRecipients
{
    public function __construct(private SupervisorOwner $owner) {}

    /**
     * The one actor the target names: none for a profile, which has no single recipient, or for an owner route with
     * no owner.
     *
     * @return Option<ActorIdentity>
     */
    public function resolve(SupervisorTarget $target): Option
    {
        if ($target->isProfile()) {
            return None::create();
        }

        if ($target->isOwner()) {
            return Option::fromValue($this->owner->resolve()->actor);
        }

        return new Some(ActorIdentity::fromText($target->key));
    }
}
