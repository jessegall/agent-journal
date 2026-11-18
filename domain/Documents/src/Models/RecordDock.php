<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A document or report docked as a card in one agent session's chat. Docking it again shows the same card; hiding
 * it keeps the row, and the record and its links stay as they were.
 *
 * @property string $id
 * @property string $recipient_type
 * @property string $recipient_id
 * @property string $parent_type
 * @property string $parent_id
 * @property bool $hidden_from_dock
 * @property CarbonImmutable $docked_at
 */
#[Fillable(['recipient_type', 'recipient_id', 'parent_type', 'parent_id', 'docked_by_type', 'docked_by_id', 'docked_at'])]
final class RecordDock extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'documents.dock';

    protected $attributes = ['hidden_from_dock' => false];

    protected function casts(): array
    {
        return [
            'docked_by_type' => ActorType::class,
            'hidden_from_dock' => 'boolean',
            'docked_at' => 'immutable_datetime',
        ];
    }

    /**
     * Docks the record in the session, or shows its card again when it was hidden.
     */
    public static function dockIn(ActorIdentity $recipient, RecordIdentity $record, Actor $actor): self
    {
        $dock = self::query()->inDockOf($recipient)->where('parent_type', $record->type)->where('parent_id', $record->id)->first();

        if ($dock !== null) {
            $dock->hidden_from_dock = false;
            $dock->save();

            return $dock;
        }

        return self::query()->create([
            'recipient_type' => $recipient->type->value,
            'recipient_id' => $recipient->id,
            'parent_type' => $record->type,
            'parent_id' => $record->id,
            'docked_by_type' => $actor->actorType(),
            'docked_by_id' => $actor->actorId(),
            'docked_at' => CarbonImmutable::now(),
        ]);
    }

    /**
     * Hides the record's card in the session; nothing else changes.
     */
    public static function hideIn(ActorIdentity $recipient, RecordIdentity $record): void
    {
        self::query()->inDockOf($recipient)->where('parent_type', $record->type)->where('parent_id', $record->id)->update(['hidden_from_dock' => true]);
    }

    /**
     * The cards of one session, newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inDockOf(Builder $query, ActorIdentity $recipient): void
    {
        $query->where('recipient_type', $recipient->type->value)->where('recipient_id', $recipient->id)->orderByDesc('docked_at')->orderByDesc('id');
    }
}
