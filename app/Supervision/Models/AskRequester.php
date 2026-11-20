<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['actor_type', 'actor_id'])]
final class AskRequester extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.ask-requester';

    // ----------[ Queries ]----------

    /**
     * Writes the requester row so a concurrent repeatable-read submission retries with a fresh snapshot.
     */
    public static function lockSubmissions(ActorIdentity $actor): void
    {
        self::query()->upsert(
            [...$actor->asColumns('actor'), 'updated_at' => CarbonImmutable::now()],
            ['actor_type', 'actor_id'],
            ['updated_at'],
        );
    }
}
