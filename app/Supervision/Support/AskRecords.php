<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Reads\Support\ReadBuilder;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Supervision\Models\Ask;
use App\Supervision\Values\AskReference;

final readonly class AskRecords
{
    public function __construct(private CurrentActor $current, private SupervisorOwner $owner) {}

    public function read(AskReference $reference): Ask
    {
        return $this->visible()->whereKey($reference->id)->first()
            ?? throw RecordUnavailable::for(new RecordIdentity(Ask::LINK_TYPE, $reference->id));
    }

    public function lock(AskReference $reference): Ask
    {
        return $this->visible()->whereKey($reference->id)->lockForUpdate()->first()
            ?? throw RecordUnavailable::for(new RecordIdentity(Ask::LINK_TYPE, $reference->id));
    }

    /**
     * @return ReadBuilder<Ask>
     */
    public function visible(): ReadBuilder
    {
        return Ask::query()->visibleToParticipant(ActorIdentity::of($this->current->actor()), $this->owner->resolve());
    }
}
