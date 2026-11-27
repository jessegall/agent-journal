<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Models\Support\Accessor;
use App\Models\Support\HasUlidKey;
use App\Models\Support\SignedInScope;
use App\Records\Concerns\CountsPivotLoads;
use App\Records\Contracts\ReadableModel;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\MorphPivot;

/**
 * @property string $id
 * @property string $record_type
 * @property string $record_id
 * @property string $holder_type
 * @property string $holder_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $to_assignment
 *
 * @mixin \Eloquent
 */
#[Table('assignments')]
final class AssignmentRecord extends MorphPivot implements ReadableModel
{
    use BoundedReads;
    use CountsPivotLoads;
    use HasUlidKey;
    use InsertsAbsentRows;
    use Linkable;
    use OrdersById;

    /**
     * A pivot opens every attribute by default; this one stays closed, as every model writes its columns as properties.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    protected static function booted(): void
    {
        self::addGlobalScope(
            new SignedInScope(
                static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class),
                static fn (): ActorVisibility => Container::getInstance()->make(ActorVisibility::class),
            ),
        );
    }

    // ----------[ Constructors ]----------

    /**
     * Gives an unheld record to the holder in one insert that does nothing when the record already has a holder, so
     * the unique record key decides between two writers without aborting the transaction.
     */
    public static function createForFreeRecord(RecordIdentity $record, AssigneeIdentity $holder): void
    {
        $row = new self();
        $row->record_type = $record->type;
        $row->record_id = $record->id;
        $row->holder_type = $holder->type;
        $row->holder_id = $holder->id;

        $row->setAttribute($row->getKeyName(), $row->newUniqueId());
        $row->insertIfAbsent();
    }

    public static function create(RecordIdentity $record, AssigneeIdentity $holder): self
    {
        $assignmentRecord = new self();
        $assignmentRecord->record_type = $record->type;
        $assignmentRecord->record_id = $record->id;
        $assignmentRecord->holder_type = $holder->type;
        $assignmentRecord->holder_id = $holder->id;
        $assignmentRecord->save();

        return $assignmentRecord;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<Assignment, never>
     */
    protected function toAssignment(): Attribute
    {
        return Accessor::get(fn () => new Assignment(
            new RecordIdentity($this->record_type, $this->record_id),
            new AssignmentReference($this->id, new AssigneeIdentity($this->holder_type, $this->holder_id)),
        ));
    }

    // ----------[ Queries ]----------

    /**
     * The current holder of each of these exact assignments that still exists, keyed by assignment id.
     *
     * @param  list<string>  $ids
     * @return array<string, AssigneeIdentity>
     */
    public static function resolveHoldersOf(array $ids): array
    {
        return self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->whereKey($ids)
            ->get()
            ->mapWithKeys(fn (self $row) => [$row->id => $row->toAssignment->holder()])
            ->all();
    }

    /**
     * These exact assignments that still exist, keyed by assignment id.
     *
     * @param  list<string>  $ids
     * @return array<string, Assignment>
     */
    public static function resolveAssignmentsOf(array $ids): array
    {
        return self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->whereKey($ids)
            ->get()
            ->mapWithKeys(fn (self $row) => [$row->id => $row->toAssignment])
            ->all();
    }

    /**
     * The current assignments of these records of one type, read by a trusted provider path.
     *
     * @param  list<string>  $ids
     * @return list<self>
     */
    public static function findForRecords(string $type, array $ids): array
    {
        return array_values(self::query()
            ->withoutGlobalScope(SignedInScope::class)
            ->ofRecordIds($type, $ids)
            ->get()
            ->all());
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

    /**
     * The claims the work assignment proves.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function provedBy(Builder $query, AssignmentReference $source): void
    {
        $query->whereIn('id', ClaimAuthorization::query()->claimIdsFor($source));
    }

    /**
     * The rows of the records of one type.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofRecordIds(Builder $query, string $type, array $ids): void
    {
        $query->where('record_type', $type)->whereIn('record_id', $ids);
    }

    /**
     * The assignments of any of the records, their ids listed by record type.
     *
     * @param  Builder<self>  $query
     * @param  array<string, list<string>>  $idsByType
     */
    #[Scope]
    protected function ofAnyRecords(Builder $query, array $idsByType): void
    {
        $query->where(function (Builder $records) use ($idsByType): void {
            foreach ($idsByType as $type => $ids) {
                $records->orWhere(
                    fn (Builder $ofType) => $ofType->where('record_type', $type)->whereIn('record_id', $ids),
                );
            }
        });
    }

    /**
     * The assignments of records whose id comes after the given one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function recordAfter(Builder $query, string $recordId): void
    {
        $query->where('record_id', '>', $recordId);
    }

    /**
     * The assignments by their record id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byRecordId(Builder $query): void
    {
        $query->orderBy('record_id');
    }

    /**
     * The assignments of records of the given type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRecordType(Builder $query, string $recordType): void
    {
        $query->where('record_type', $recordType);
    }

    /**
     * The assignments seen by no signed-in user in particular.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function acrossSignIns(Builder $query): void
    {
        $query->withoutGlobalScope(SignedInScope::class);
    }

    /**
     * Only the record of each assignment, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function recordIds(Builder $query): void
    {
        $query->select('record_id');
    }
}
