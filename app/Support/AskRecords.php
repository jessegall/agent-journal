<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Exceptions\RecordUnavailable;
use App\Models\Ask;
use App\Values\AskReference;

final readonly class AskRecords
{
    public function __construct(private CurrentActor $current, private SupervisorOwner $owner) {}

    public function read(AskReference $reference): Ask
    {
        return $this->visible()->whereKey($reference->id)->firstOr(
            fn () => throw RecordUnavailable::for(new RecordIdentity(Ask::LINK_TYPE, $reference->id)),
        );
    }

    public function lock(AskReference $reference): Ask
    {
        return $this->visible()->whereKey($reference->id)->lockForUpdate()->firstOr(
            fn () => throw RecordUnavailable::for(new RecordIdentity(Ask::LINK_TYPE, $reference->id)),
        );
    }

    /**
     * @return ReadBuilder<Ask>
     */
    public function visible(): ReadBuilder
    {
        return Ask::query()->visibleToParticipant(ActorIdentity::of($this->current->actor()), $this->owner->resolve());
    }
}
