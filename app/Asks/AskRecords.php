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
        return $this->foundIn($this->visible(), $reference);
    }

    public function lock(AskReference $reference): Ask
    {
        return $this->foundIn($this->visible()->lockForUpdate(), $reference);
    }

    /**
     * @return ReadBuilder<Ask>
     */
    public function visible(): ReadBuilder
    {
        return Ask::query()->visibleToParticipant($this->current->actor(), $this->owner->resolve());
    }

    /**
     * The ask the reference names among the query's rows; unavailable when it is not there.
     *
     * @param  ReadBuilder<Ask>  $query
     */
    private function foundIn(ReadBuilder $query, AskReference $reference): Ask
    {
        return $query->whereKey($reference->id)->firstOr(
            RecordUnavailable::throwing()->for(new RecordIdentity(Ask::linkType(), $reference->id)),
        );
    }
}
