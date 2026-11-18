<?php

declare(strict_types=1);

namespace App\Assignments\Models;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Models\Support\SignedInScope;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\RecordIdentity;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The one current holder of a record: a row is inserted to assign, deleted to unassign and replaced by a new row to
 * reassign, so a reference names one holding exactly. Only Core's store writes it.
 *
 * @property int $id
 * @property string $record_type
 * @property int $record_id
 * @property ActorType $holder_type
 * @property int $holder_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['record_type', 'record_id', 'holder_type', 'holder_id'])]
final class AssignmentRecord extends Model
{
    protected $table = 'assignments';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['holder_type' => ActorType::class];
    }

    public static function holding(RecordIdentity $record, ActorIdentity $holder): self
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
            new AssignmentReference($this->id, new ActorIdentity($this->holder_type, $this->holder_id)),
        );
    }

    protected static function booted(): void
    {
        self::addGlobalScope(new SignedInScope(static fn (): CurrentActor => Container::getInstance()->make(CurrentActor::class)));
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
     * The explicit read of every assignment an actor holds, for Core's retirement of that actor; it lifts the
     * signed-in limit because retirement may run with nobody else to see the rows.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldForRetirement(Builder $query, ActorIdentity $holder): void
    {
        $query->withoutGlobalScope(SignedInScope::class)
            ->where('holder_type', $holder->type)
            ->where('holder_id', $holder->id);
    }
}
