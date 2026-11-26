<?php

declare(strict_types=1);

namespace App\Models\Asks;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class AskRequester extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * Writes the requester row so a concurrent repeatable-read submission retries with a fresh snapshot.
     */
    public static function create(ActorReference $actor): void
    {
        $requester = new self();

        $requester->setRawAttributes([
            $requester->getKeyName() => $requester->newUniqueId(),
            'actor_type' => $actor->type,
            'actor_id' => $actor->id,
        ]);

        $requester->insertIfAbsent();
        self::findLockedOfActor($actor);
    }

    // ----------[ Queries ]----------

    /**
     * The actor's requester row, locked until the transaction ends.
     */
    public static function findLockedOfActor(ActorReference $actor): self
    {
        return self::query()->ofActor($actor)->lockForUpdate()->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * The actor's requester row.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofActor(Builder $query, ActorReference $actor): void
    {
        $query->where($actor->asColumns('actor'));
    }
}
