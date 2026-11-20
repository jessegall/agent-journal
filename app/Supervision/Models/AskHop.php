<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Support\ActorIdentity;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['ask_id', 'actor_type', 'actor_id', 'type_key', 'version', 'route_version', 'accepted_at'])]
final class AskHop extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;

    protected function casts(): array
    {
        return ['accepted_at' => 'immutable_datetime', 'version' => 'integer', 'route_version' => 'integer'];
    }

    public static function recordAcceptance(Ask $ask, ActorIdentity $holder, int $routeVersion): void
    {
        self::query()->create([
            'ask_id' => $ask->id,
            'actor_type' => $holder->type->value,
            'actor_id' => $holder->id,
            'type_key' => $ask->type_key,
            'version' => $ask->version,
            'route_version' => $routeVersion,
            'accepted_at' => CarbonImmutable::now(),
        ]);
    }

    /** @param Builder<self> $query */
    #[Scope]
    protected function acceptedBy(Builder $query, ActorIdentity $actor): void
    {
        $query->where('actor_type', $actor->type->value)->where('actor_id', $actor->id);
    }
}
