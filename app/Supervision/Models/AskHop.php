<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Models\Support\HasActorColumns;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Closure;

/**
 * @property string|null $result
 * @property string|null $attention
 * @property string|null $wake
 * @property string $id
 * @property string $ask_id
 * @property int $version
 * @property string $actor_type
 * @property string $actor_id
 */
#[Fillable(['ask_id', 'actor_type', 'actor_id', 'type_key', 'version', 'route_version', 'accepted_at'])]
final class AskHop extends Model implements ReadableModel
{
    use BoundedReads, HasActorColumns, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.ask-hop';

    public const string PENDING_DELIVERY = 'pending';

    protected function casts(): array
    {
        return ['accepted_at' => 'immutable_datetime', 'version' => 'integer', 'route_version' => 'integer'];
    }

    public static function recordAcceptance(Ask $ask, ActorIdentity $holder, int $routeVersion): self
    {
        return self::query()->create([
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

    public function holder(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id);
    }

    public function recordWake(string $wake): void
    {
        $this->wake = $wake;
        $this->save();
    }

    public function recordAttention(string $attention): void
    {
        $this->attention = $attention;
        $this->save();
    }

    /**
     * @param Builder<self> $query
     */
    #[Scope]
    protected function currentHops(Builder $query): void
    {
        $query->join('asks', 'asks.id', '=', 'ask_hops.ask_id')
            ->join('assignments', function ($assignment): void {
                $assignment->on('assignments.record_id', '=', 'ask_hops.ask_id')
                    ->where('assignments.record_type', Ask::LINK_TYPE)
                    ->whereColumn('assignments.holder_type', 'ask_hops.actor_type')
                    ->whereColumn('assignments.holder_id', 'ask_hops.actor_id');
            })
            ->where('asks.open', true)->whereColumn('asks.version', 'ask_hops.version')
            ->select('ask_hops.*');
    }

    /**
     * @param list<string> $hops
     * @return list<string>
     */
    public static function activeIds(array $hops): array
    {
        if ($hops === []) {
            return [];
        }

        return array_values(self::query()->currentHops()->whereIn('ask_hops.id', $hops)
            ->readLimit(count($hops))->pluck('ask_hops.id')->map(strval(...))->all());
    }

    public static function nextFor(ActorIdentity $holder): self|null
    {
        return self::query()->currentHops()
            ->where('ask_hops.actor_type', $holder->type->value)
            ->where('ask_hops.actor_id', $holder->id)
            ->oldest('ask_hops.accepted_at')->orderBy('ask_hops.id')->first();
    }

    /**
     * @param Closure(self): void $recover
     */
    public static function recoverEach(Closure $recover): void
    {
        self::query()->where(fn (Builder $waiting) => $waiting
            ->where('attention', self::PENDING_DELIVERY)
            ->orWhereIn('id', self::query()->currentHops()->select('ask_hops.id')))
            ->readInChunks(50, function ($hops) use ($recover): void {
                foreach ($hops as $hop) {
                    $recover($hop);
                }
            });
    }

    public function lockDelivery(): self
    {
        return self::query()->whereKey($this->id)->lockForUpdate()->firstOrFail();
    }
}
