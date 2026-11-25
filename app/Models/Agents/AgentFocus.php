<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sessions\AgentFocusCleared;
use App\Events\Sessions\AgentFocusMoved;
use App\Models\Support\Accessor;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $agent_id
 * @property string $focused_type
 * @property string $focused_id
 * @property CarbonImmutable $focused_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $record
 *
 * @mixin \Eloquent
 */
final class AgentFocus extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    protected $table = 'agent_focuses';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'focused_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The agent's focus, locked; a new, unsaved one when it focuses on nothing yet.
     */
    public static function create(string $agentId): self
    {
        $focus = self::query()->ofAgent($agentId)->lockForUpdate()->first();

        if ($focus instanceof self) {
            return $focus;
        }

        $focus = new self();
        $focus->agent_id = $agentId;

        return $focus;
    }

    // ----------[ Mutations ]----------

    /**
     * Moves the focus to the record; a record already in focus is left as it is.
     */
    public function moveTo(RecordIdentity $record): void
    {
        if ($this->exists && $this->holds($record)) {
            return;
        }

        $this->focused_type = $record->type;
        $this->focused_id = $record->id;
        $this->focused_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new AgentFocusMoved($this->agent_id, $record->type, $record->id));
    }

    /**
     * Takes the record out of focus; a focus on another record, or on nothing, is left as it is.
     */
    public function clear(RecordIdentity $record): void
    {
        if (! $this->exists || ! $this->holds($record)) {
            return;
        }

        $this->delete();
        $this->raise(new AgentFocusCleared($this->agent_id, $record->type, $record->id));
    }

    // ----------[ Predicates ]----------

    public function holds(RecordIdentity $record): bool
    {
        return $this->focused_type === $record->type && $this->focused_id === $record->id;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<RecordIdentity, never>
     */
    protected function record(): Attribute
    {
        return Accessor::get(fn () => new RecordIdentity($this->focused_type, $this->focused_id));
    }

    // ----------[ Scopes ]----------

    /**
     * The focuses on any of the records.
     *
     * @param  Builder<self>  $query
     * @param  list<RecordIdentity>  $records
     */
    #[Scope]
    protected function onRecords(Builder $query, array $records): void
    {
        $query->where(function (Builder $any) use ($records): void {
            foreach ($records as $record) {
                $any->orWhere(fn (Builder $one) => $one->where('focused_type', $record->type)
                    ->where('focused_id', $record->id));
            }
        });
    }

    /**
     * The agent's focus.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }
}
