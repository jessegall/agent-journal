<?php

declare(strict_types=1);

namespace App\Asks;

use App\Actors\Contracts\CurrentActor;
use App\Exceptions\RecordUnavailable;
use App\Models\Asks\Ask;
use App\Support\BoundedReadBuilder;
use App\Support\RecordIdentity;
use App\Values\AskReference;
use Illuminate\Database\Eloquent\Collection;

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
     * @return BoundedReadBuilder<Ask>
     */
    public function visible(): BoundedReadBuilder
    {
        return Ask::query()->visibleToParticipant($this->current->actor(), $this->owner->resolve());
    }

    /** @return Collection<int, Ask> */
    public function preview(int $limit): Collection
    {
        return $this->visible()->orderByDesc('id')->limit($limit)->get(['id', 'body', 'open']);
    }

    /**
     * The ask the reference names among the query's rows; unavailable when it is not there.
     *
     * @param  BoundedReadBuilder<Ask>  $query
     */
    private function foundIn(BoundedReadBuilder $query, AskReference $reference): Ask
    {
        return $query->whereKey($reference->id)->firstOr(
            RecordUnavailable::throwing()->for(new RecordIdentity(Ask::linkType(), $reference->id)),
        );
    }
}
