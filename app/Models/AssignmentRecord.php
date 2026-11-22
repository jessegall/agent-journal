<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\CountsPivotLoads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\ActorVisibility;
use App\Contracts\CurrentActor;
use App\Contracts\ReadableModel;
use App\Models\Support\SignedInScope;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Support\Carbon;

/**
 * The one current holder of a record: a row is inserted to assign, deleted to unassign and replaced by a new row to
 * reassign, so a reference names one holding exactly. Only Core's store writes it.
 *
 * @property string $id
 * @property string $record_type
 * @property string $record_id
 * @property string $holder_type
 * @property string $holder_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('assignments')]
#[Fillable(['record_type', 'record_id', 'holder_type', 'holder_id'])]
final class AssignmentRecord extends MorphPivot implements ReadableModel
{
    use BoundedReads;
    use CountsPivotLoads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * Gives an unheld record to the holder in one insert that does nothing when the record already has a holder, so
     * the unique record key decides between two writers without aborting the transaction.
     */
    public static function insertUnlessHeld(RecordIdentity $record, AssigneeIdentity $holder): void
    {
        $row = new self([
            'record_type' => $record->type,
            'record_id' => $record->id,
            'holder_type' => $holder->type,
            'holder_id' => $holder->id,
        ]);

        $row->setAttribute($row->getKeyName(), $row->newUniqueId());
        $row->insertIfAbsent();
    }

    public static function create(RecordIdentity $record, AssigneeIdentity $holder): self
    {
        return self::query()->create([
            'record_type' => $record->type,
            'record_id' => $record->id,
            'holder_type' => $holder->type,
            'holder_id' => $holder->id,
        ]);
    }

    protected static function booted(): void
    {
        self::addGlobalScope(
            new SignedInScope(
                static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class),
                static fn (): ActorVisibility => Container::getInstance()->make(ActorVisibility::class),
            ),
        );
    }

    // ----------[ Queries ]----------

    /**
     * The claims a lost assignment proved, whoever holds them, for their release.
     *
     * @return Builder<self>
     */
    public static function claimsProvedBy(AssignmentReference $source): Builder
    {
        return self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->whereIn('id', ClaimAuthorization::claimIdsFor($source));
    }

    /**
     * The current holder of each of these exact assignments that still exists, keyed by assignment id.
     *
     * @param  list<string>  $ids
     * @return array<string, AssigneeIdentity>
     */
    public static function holdersOf(array $ids): array
    {
        return self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->whereKey($ids)
            ->get()
            ->mapWithKeys(fn (self $row) => [$row->id => $row->toAssignment()->holder()])
            ->all();
    }

    /**
     * These exact assignments that still exist, keyed by assignment id.
     *
     * @param  list<string>  $ids
     * @return array<string, Assignment>
     */
    public static function assignmentsOf(array $ids): array
    {
        return self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->whereKey($ids)
            ->get()
            ->mapWithKeys(fn (self $row) => [$row->id => $row->toAssignment()])
            ->all();
    }

    /**
     * The current assignments of these records of one type, read by a trusted provider path.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function ofRecords(string $type, array $ids): array
    {
        return array_values(self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->where('record_type', $type)
            ->whereIn('record_id', $ids)
            ->get()
            ->all());
    }

    /**
     * Whether this exact assignment still exists, whoever holds it.
     */
    public static function stillExists(string $assignmentId): bool
    {
        return self::holdersOf([$assignmentId]) !== [];
    }

    // ----------[ Answers ]----------

    public function toAssignment(): Assignment
    {
        return new Assignment(
            new RecordIdentity($this->record_type, $this->record_id),
            new AssignmentReference($this->id, new AssigneeIdentity($this->holder_type, $this->holder_id)),
        );
    }

    // ----------[ Scopes ]----------

    /**
     * The record's assignment whoever holds it, for the store that must see the real current holder.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forRecord(Builder $query, RecordIdentity $record): void
    {
        $query->withoutGlobalScope(SignedInScope::class)
            ->where('record_type', $record->type)
            ->where('record_id', $record->id);
    }

    /**
     * The assignments of several records whoever holds them, read in one query.
     *
     * @param  Builder<self>  $query
     * @param  list<RecordIdentity>  $records
     */
    #[Scope]
    protected function forRecords(Builder $query, array $records): void
    {
        $query->withoutGlobalScope(SignedInScope::class)->where(function (Builder $any) use ($records): void {
            foreach ($records as $record) {
                $any->orWhere(fn (Builder $one) => $one->where('record_type', $record->type)
                    ->where('record_id', $record->id));
            }
        });
    }

    /**
     * The ids of the records of one type the holder holds, for a domain's trusted count and pick to filter by. It
     * lifts the signed-in limit, since the engine fills assignments with nobody signed in.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldRecordIds(Builder $query, string $type, AssigneeIdentity $holder): void
    {
        $query->withoutGlobalScope(SignedInScope::class)
            ->select('record_id')
            ->where('record_type', $type)
            ->where('holder_type', $holder->type)
            ->where('holder_id', $holder->id);
    }

    /**
     * The assignments of one record type among the given record ids, read by a trusted provider path.
     *
     * @param  Builder<self>  $query
     * @param  Builder<*>  $ids
     */
    #[Scope]
    protected function assignedAmong(Builder $query, string $type, Builder $ids): void
    {
        $query->withoutGlobalScope(SignedInScope::class)
            ->where('record_type', $type)
            ->whereIn('record_id', $ids);
    }

    /**
     * The assignments the assignee holds itself or through a holder it shares work with.
     *
     * @param  Builder<self>  $query
     * @param  array<string, Builder<*>>  $shared
     */
    #[Scope]
    protected function heldOrShared(Builder $query, AssigneeIdentity $holder, array $shared): void
    {
        $query->where(function (Builder $holders) use ($holder, $shared): void {
            $holders->where(
                fn (Builder $own) => $own->where('holder_type', $holder->type)->where('holder_id', $holder->id),
            );

            foreach ($shared as $type => $ids) {
                $holders->orWhere(
                    fn (Builder $group) => $group->where('holder_type', $type)->whereIn('holder_id', $ids),
                );
            }
        });
    }

    /**
     * The assignments one assignee holds.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldBy(Builder $query, AssigneeIdentity $holder): void
    {
        $query->where('holder_type', $holder->type)->where('holder_id', $holder->id);
    }

    /**
     * The ids of the records of one type anyone holds, for a domain's trusted pick to leave out. It lifts the
     * signed-in limit, since the engine fills assignments with nobody signed in.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function assignedRecordIds(Builder $query, string $type): void
    {
        $query->withoutGlobalScope(SignedInScope::class)
            ->select('record_id')
            ->where('record_type', $type);
    }

    /**
     * The explicit read of every assignment an actor holds, for Core's retirement of that actor; it lifts the
     * signed-in limit because retirement may run with nobody else to see the rows.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldForRetirement(Builder $query, AssigneeIdentity $holder): void
    {
        $query->withoutGlobalScope(SignedInScope::class)
            ->where('holder_type', $holder->type)
            ->where('holder_id', $holder->id);
    }
}
