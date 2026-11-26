<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Assignments\AutoAssignmentConfigured;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Support\HasActorColumns;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentPage;
use App\Support\IdListPage;
use App\Support\PoolReference;
use App\Support\ReadBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use PhpOption\Option;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $assignable_type
 * @property bool $enabled
 * @property PoolReference $pool
 * @property int $size
 * @property int $configuration_revision
 * @property CarbonImmutable|null $last_served_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('auto_assignments')]
final class AutoAssignment extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'pool' => PoolReference::class,
            'size' => 'integer',
            'configuration_revision' => 'integer',
            'last_served_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Enables the actor's first auto-assignment of the type at revision 1 with one insert that does nothing when a row
     * is already there, so the unique key decides between two writers; answers the row, locked.
     */
    public static function create(AutoAssignmentInput $input): self
    {
        $key = $input->key;

        $row = new self();
        $row->actor_type = $key->actor->type;
        $row->actor_id = $key->actor->id;
        $row->assignable_type = $key->assignableType;
        $row->enabled = true;
        $row->pool = $input->pool;
        $row->size = $input->size;
        $row->configuration_revision = 1;

        $row->setAttribute($row->getKeyName(), $row->newUniqueId());
        $row->insertIfAbsent();

        return self::query()->forKey($input->key)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Sets whether it is on, its pool and its size, and moves to the next revision only when one of them changed;
     * answers whether anything changed.
     */
    public function configure(bool $isEnabled, PoolReference $pool, int $size): bool
    {
        if ($this->enabled === $isEnabled && $this->pool->isSameAs($pool) && $this->size === $size) {
            return false;
        }

        $this->enabled = $isEnabled;
        $this->pool = $pool;
        $this->size = $size;
        $this->configuration_revision++;
        $this->assertSaved($this->save());
        $this->raise(new AutoAssignmentConfigured($this->id, $isEnabled, $size));

        return true;
    }

    public function markServedAt(CarbonImmutable $time): void
    {
        self::query()->whereKey($this->id)->update(['last_served_at' => $time]);
    }

    // ----------[ Predicates ]----------

    public function isAtRevision(int $expected): bool
    {
        return $this->configuration_revision === $expected;
    }

    // ----------[ Transformers ]----------

    /**
     * @throws CannotCreateData
     * @throws AssignmentTypeUnavailable
     */
    public function toFact(): AutoAssignmentFact
    {
        return new AutoAssignmentFact(
            $this->id,
            new AutoAssignmentKey($this->actor(), $this->assignable_type),
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
    private static function pageOf(ReadBuilder $query, IdListPage $page): AutoAssignmentPage
    {
        $rows = $query
            ->pageAfter($page->afterId)
            ->readExactly($page->limit + 1)
            ->get();

        $shown = $rows->take($page->limit);
        $facts = array_values($shown->map(fn (self $row) => $row->toFact())->all());
        $hasMore = $rows->count() > $page->limit;

        return new AutoAssignmentPage($facts, $hasMore ? $shown->last()?->id : null);
    }

    // ----------[ Queries ]----------

    /**
     * The actor's auto-assignment of the type, its row locked for update; none when it was never enabled.
     *
     * @return Option<self>
     */
    public static function findLockedFor(AutoAssignmentKey $key): Option
    {
        $autoAssignment = self::query()->forKey($key)->lockForUpdate()->first();

        return Option::fromValue($autoAssignment);
    }

    /**
     * One page of the auto-assignments that are on, by id, for the engine to consider.
     */
    public static function resolveEnabledPage(IdListPage $page): AutoAssignmentPage
    {
        return self::pageOf(self::query()->enabled(), $page);
    }

    /**
     * One page of the actor's auto-assignments, on or off, by id.
     */
    public static function resolvePageFor(ActorReference $actor, IdListPage $page): AutoAssignmentPage
    {
        return self::pageOf(self::query()->ofActor($actor), $page);
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
    protected function ofActor(Builder $query, ActorReference $actor): void
    {
        $query->where('actor_type', $actor->type)->where('actor_id', $actor->id);
    }

    /**
     * The rows after the id, in id order; all of them, in id order, with none.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pageAfter(Builder $query, string|null $afterId): void
    {
        $query->when($afterId !== null, fn (Builder $after) => $after->where('id', '>', $afterId))->orderBy('id');
    }

    /**
     * The enabled auto-assignments.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function enabled(Builder $query): void
    {
        $query->where('enabled', true);
    }
}
