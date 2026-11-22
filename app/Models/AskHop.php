<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Enums\CoreAskType;
use App\Events\AskHopAssigned;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * @property string|null $result
 * @property string|null $attention
 * @property string|null $wake
 * @property string $id
 * @property string $ask_id
 * @property int $version
 * @property string $actor_type
 * @property string $actor_id
 * @property string $type_key
 * @property CarbonImmutable $accepted_at
 */
#[Fillable(['ask_id', 'actor_type', 'actor_id', 'type_key', 'version', 'route_version', 'accepted_at'])]
final class AskHop extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.ask-hop';

    public const string PENDING_DELIVERY = 'pending';

    /**
     * Orders question and stuck asks before review and merge asks.
     */
    private const string URGENT_FIRST = 'case when ask_hops.type_key in (?, ?) then 0 else 1 end';

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return ['accepted_at' => 'immutable_datetime', 'version' => 'integer', 'route_version' => 'integer'];
    }

    /**
     * The ask's new hop to its holder, at the ask's version and the routing configuration's version, kept apart.
     */
    public static function create(Ask $ask, ActorIdentity $holder, int $routeVersion): self
    {
        $hop = new self([
            'ask_id' => $ask->id,
            ...$holder->asColumns('actor'),
            'type_key' => $ask->type_key,
            'version' => $ask->version,
            'route_version' => $routeVersion,
            'accepted_at' => CarbonImmutable::now(),
        ]);

        $hop->assertSaved($hop->save());
        $hop->raise(new AskHopAssigned($ask->id, $hop->id, $hop->type_key, $holder));

        return $hop;
    }

    // ----------[ Queries ]----------

    /**
     * The holder of the ask's hop before this one, when the ask had one.
     *
     * @return Option<ActorIdentity>
     */
    public static function holderBefore(string $askId, string $hopId): Option
    {
        return self::query()
            ->where('ask_id', $askId)
            ->whereKeyNot($hopId)
            ->reorder('version', 'desc')
            ->orderByDesc('id')
            ->firstOption()
            ->map(fn (self $hop) => $hop->actor());
    }

    /**
     * The holder of the ask's newest hop, the final holder once the ask closed, when the ask was ever assigned.
     *
     * @return Option<ActorIdentity>
     */
    public static function latestHolderOf(string $askId): Option
    {
        return self::query()
            ->where('ask_id', $askId)
            ->reorder('version', 'desc')
            ->orderByDesc('id')
            ->firstOption()
            ->map(fn (self $hop) => $hop->actor());
    }

    public static function currentFor(Ask $ask): self
    {
        return self::query()->where('ask_id', $ask->id)->where('version', $ask->version)->firstOrFail();
    }

    /**
     * @param  list<string>  $asks
     * @return array<string, string>
     */
    public static function repliesTo(array $asks): array
    {
        return self::query()->whereIn('ask_id', $asks)->whereNotNull('result')->pluck('result', 'ask_id')->all();
    }

    /**
     * The version of each of the hops that is still current, keyed by hop id; a hop that is no longer current is left
     * out.
     *
     * @param  list<string>  $hops
     * @return array<string, int>
     */
    public static function activeVersions(array $hops): array
    {
        if ($hops === []) {
            return [];
        }

        return self::query()->currentHops()->whereIn('ask_hops.id', $hops)->readExactly(count($hops))
            ->pluck('ask_hops.version', 'ask_hops.id')->map(fn (mixed $version) => (int) $version)->all();
    }

    public static function nextFor(ActorIdentity $holder): self|null
    {
        return self::query()->currentHops()
            ->where('ask_hops.actor_type', $holder->type->value)
            ->where('ask_hops.actor_id', $holder->id)
            ->orderByRaw(self::URGENT_FIRST, CoreAskType::urgentKeys())
            ->oldest('ask_hops.accepted_at')->orderBy('ask_hops.id')->first();
    }

    /**
     * The unanswered current hops of open asks, oldest first, for the ask clock.
     *
     * @return list<self>
     */
    public static function unansweredCurrent(int $limit): array
    {
        $hops = self::query()->currentHops()
            ->whereNull('ask_hops.result')
            ->oldest('ask_hops.accepted_at')
            ->orderBy('ask_hops.id')
            ->readExactly($limit)
            ->get();

        return array_values($hops->all());
    }

    /**
     * When each holder last answered a hop, by holder key, so its queued asks wait from that moment.
     *
     * @return array<string, CarbonImmutable>
     */
    public static function lastAnswerTimes(): array
    {
        $answered = self::query()
            ->whereNotNull('result')
            ->groupBy('actor_type', 'actor_id')
            ->selectRaw('actor_type, actor_id, max(updated_at) as answered_at')
            ->readAll('one row per holder that ever answered, to start its queue clock')
            ->get();

        $times = [];

        foreach ($answered as $row) {
            $times[$row->holderKey()] = CarbonImmutable::parse((string) $row->getAttribute('answered_at'));
        }

        return $times;
    }

    /**
     * Whether the actor already held a hop of the ask, which makes an escalation to it a cycle.
     */
    public static function hasHeld(Ask $ask, ActorIdentity $actor): bool
    {
        return self::query()->where('ask_id', $ask->id)->byActor($actor)->exists();
    }

    // ----------[ Mutations ]----------

    public function answer(string $body, string $attention): void
    {
        $this->result = $body;
        $this->attention = $attention;
        $this->save();
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

    // ----------[ Answers ]----------

    public function isHeldByAgent(): bool
    {
        return $this->actor()->type->isAgent();
    }

    /**
     * The holder as one text, to group the hops of one holder's queue.
     */
    public function holderKey(): string
    {
        return "{$this->actor_type}:{$this->actor_id}";
    }

    public function lockDelivery(): self
    {
        return self::query()->whereKey($this->id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
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
}
