<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['actor_type', 'actor_id'])]
final class AskRequester extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string LINK_TYPE = 'core.ask-requester';

    // ----------[ Queries ]----------

    /**
     * Writes the requester row so a concurrent repeatable-read submission retries with a fresh snapshot.
     */
    public static function lockSubmissions(ActorIdentity $actor): void
    {
        $requester = new self();

        $requester->setRawAttributes([
            $requester->getKeyName() => $requester->newUniqueId(),
            ...$actor->asColumns('actor'),
        ]);

        $requester->insertIfAbsent();
        self::query()->where($actor->asColumns('actor'))->lockForUpdate()->sole();
    }
}
