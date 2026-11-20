<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Support\ActorIdentity;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string|null $result
 * @property string|null $attention
 */
#[Fillable(['ask_id', 'actor_type', 'actor_id', 'type_key', 'version', 'route_version', 'accepted_at'])]
final class AskHop extends Model implements ReadableModel
{
    use BoundedReads, HasActorColumns, HasUlids;

    protected function casts(): array
    {
        return ['accepted_at' => 'immutable_datetime', 'version' => 'integer', 'route_version' => 'integer'];
    }

    public static function recordAcceptance(Ask $ask, ActorIdentity $holder, int $routeVersion): void
    {
        self::query()->create([
            'ask_id' => $ask->id,
            ...$holder->asColumns('actor'),
            'type_key' => $ask->type_key,
            'version' => $ask->version,
            'route_version' => $routeVersion,
            'accepted_at' => CarbonImmutable::now(),
        ]);
    }

    public static function currentFor(Ask $ask): self
    {
        return self::query()->where('ask_id', $ask->id)->where('version', $ask->version)->firstOrFail();
    }

    /**
     * @param list<string> $asks
     * @return array<string, string>
     */
    public static function repliesTo(array $asks): array
    {
        return self::query()->whereIn('ask_id', $asks)->whereNotNull('result')->pluck('result', 'ask_id')->all();
    }

    public function answer(string $body, string $attention): void
    {
        $this->result = $body;
        $this->attention = $attention;
        $this->save();
    }
}
