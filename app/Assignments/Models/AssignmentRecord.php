<?php

declare(strict_types=1);

namespace App\Assignments\Models;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Assignments\Models\Support\SignedInScope;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentReference;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Support\CountsPivotLoads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
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
    use BoundedReads, CountsPivotLoads;
    use HasUlids, Linkable;

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

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
        $now = CarbonImmutable::now();

        self::query()->insertOrIgnore([
            'id' => new self()->newUniqueId(),
            'record_type' => $record->type,
            'record_id' => $record->id,
            'holder_type' => $holder->type,
            'holder_id' => $holder->id,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public static function holding(RecordIdentity $record, AssigneeIdentity $holder): self
    {
        return self::query()->create([
            'record_type' => $record->type,
            'record_id' => $record->id,
            'holder_type' => $holder->type,
            'holder_id' => $holder->id,
        ]);
    }

    public function toAssignment(): Assignment
    {
        return new Assignment(
            new RecordIdentity($this->record_type, $this->record_id),
            new AssignmentReference($this->id, new AssigneeIdentity($this->holder_type, $this->holder_id)),
        );
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

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forRecord(Builder $query, RecordIdentity $record): void
    {
        $query->where('record_type', $record->type)->where('record_id', $record->id);
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
