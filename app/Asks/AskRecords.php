<?php

declare(strict_types=1);

namespace App\Asks;

use App\Actors\Contracts\CurrentActor;
use App\Exceptions\RecordUnavailable;
use App\Models\Asks\Ask;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Values\AskReference;

final readonly class AskRecords
{
    public function __construct(private CurrentActor $current, private SupervisorOwner $owner) {}

    public function read(AskReference $reference): Ask
    {
        return $this->visible()->whereKey($reference->id)->firstOr(
            RecordUnavailable::throwing()->for(new RecordIdentity(Ask::linkType(), $reference->id)),
        );
    }

    public function lock(AskReference $reference): Ask
    {
        return $this->visible()->whereKey($reference->id)->lockForUpdate()->firstOr(
            RecordUnavailable::throwing()->for(new RecordIdentity(Ask::linkType(), $reference->id)),
        );
    }

    /**
     * @return ReadBuilder<Ask>
     */
    public function visible(): ReadBuilder
    {
        return Ask::query()->visibleToParticipant($this->current->actor(), $this->owner->resolve());
    }
}
