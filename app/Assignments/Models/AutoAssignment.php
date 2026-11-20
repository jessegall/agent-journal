<?php

declare(strict_types=1);

namespace App\Assignments\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Casts\PoolReferenceCast;
use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentPage;
use App\Assignments\Support\Page;
use App\Assignments\Support\PoolReference;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Support\ReadBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * One actor's standing wish to be given records of one type automatically: whether it is on, the pool it draws from,
 * how many it keeps in hand, the revision of that configuration, and when it was last given one. A missing row is off.
 *
 * @property string $id
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string $assignable_type
 * @property bool $enabled
 * @property PoolReference $pool
 * @property int $size
 * @property int $configuration_revision
 * @property CarbonImmutable|null $last_served_at
 */
#[Table('auto_assignments')]
#[Fillable(['actor_type', 'actor_id', 'assignable_type', 'enabled', 'pool', 'size', 'configuration_revision'])]
final class AutoAssignment extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'actor_type' => ActorType::class,
            'enabled' => 'boolean',
            'pool' => PoolReferenceCast::class,
            'size' => 'integer',
            'configuration_revision' => 'integer',
            'last_served_at' => 'immutable_datetime',
        ];
    }

    /**
     * Enables the actor's first auto-assignment of the type at revision 1 with one insert that does nothing when a row
     * is already there, so the unique key decides between two writers; answers the row, locked.
     */
    public static function enableFirst(AutoAssignmentInput $input): self
    {
        $key = $input->key;
        $row = new self([
            'actor_type' => $key->actor->type,
            'actor_id' => $key->actor->id,
            'assignable_type' => $key->assignableType,
            'enabled' => true,
            'pool' => $input->pool,
            'size' => $input->size,
            'configuration_revision' => 1,
        ]);
        $row->setAttribute($row->getKeyName(), $row->newUniqueId());
        $row->updateTimestamps();
        self::query()->insertOrIgnore($row->getAttributes());

        return self::query()->forKey($input->key)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Queries ]----------

    /**
     * The actor's auto-assignment of the type, its row locked for update; none when it was never enabled.
     *
     * @return Option<self>
     */
    public static function lockedFor(AutoAssignmentKey $key): Option
    {
        return Option::fromValue(self::query()->forKey($key)->lockForUpdate()->first());
    }

    /**
     * One page of the auto-assignments that are on, by id, for the engine to consider.
     */
    public static function enabledPage(Page $page): AutoAssignmentPage
    {
        return self::pageOf(self::query()->where('enabled', true), $page);
    }

    /**
     * One page of the actor's auto-assignments, on or off, by id.
     */
    public static function pageFor(ActorIdentity $actor, Page $page): AutoAssignmentPage
    {
        return self::pageOf(self::query()->ofActor($actor), $page);
    }

    // ----------[ Mutations ]----------

    /**
     * Sets whether it is on, its pool and its size, and moves to the next revision only when one of them changed;
     * answers whether anything changed.
     */
    public function configure(bool $enabled, PoolReference $pool, int $size): bool
    {
        if ($this->enabled === $enabled && $this->pool->isSameAs($pool) && $this->size === $size) {
            return false;
        }

        $this->enabled = $enabled;
        $this->pool = $pool;
        $this->size = $size;
        $this->configuration_revision++;
        $this->save();

        return true;
    }

    public function markServedAt(CarbonImmutable $time): void
    {
        self::query()->whereKey($this->id)->update(['last_served_at' => $time]);
    }

    // ----------[ Answers ]----------

    public function isAtRevision(int $expected): bool
    {
        return $this->configuration_revision === $expected;
    }

    public function toFact(): AutoAssignmentFact
    {
        return new AutoAssignmentFact(
            $this->id,
            new AutoAssignmentKey(new ActorIdentity($this->actor_type, $this->actor_id), $this->assignable_type),
            $this->enabled,
            $this->pool,
            $this->size,
            $this->configuration_revision,
            $this->last_served_at,
        );
    }

    // ----------[ Internals ]----------

    /**
     * @param  ReadBuilder<self>  $query
     */
    private static function pageOf(ReadBuilder $query, Page $page): AutoAssignmentPage
    {
        $rows = $query
            ->when($page->afterId !== null, fn (Builder $after) => $after->where('id', '>', $page->afterId))
            ->orderBy('id')
            ->readLimit($page->limit + 1)
            ->get();
        $shown = $rows->take($page->limit);
        $facts = array_values($shown->map(fn (self $row) => $row->toFact())->all());
        $hasMore = $rows->count() > $page->limit;

        return new AutoAssignmentPage($facts, $hasMore ? $shown->last()?->id : null);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forKey(Builder $query, AutoAssignmentKey $key): void
    {
        $query->ofActor($key->actor)->where('assignable_type', $key->assignableType);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofActor(Builder $query, ActorIdentity $actor): void
    {
        $query->where('actor_type', $actor->type)->where('actor_id', $actor->id);
    }
}
