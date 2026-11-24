<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use App\Support\Cards\DockIdentity;
use App\Support\Sources\DockDefinition;
use Carbon\CarbonImmutable;
use Domain\Chat\Events\DockChanged;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A source docked in one conversation, shared by both sides of it: which source, in which presentation, and who
 * docked it when. Removing it never touches the source.
 *
 * @property string $id
 * @property string $conversation_id
 * @property string $dockable_type
 * @property string $dockable_id
 * @property string $presentation
 * @property string $assigned_by_type
 * @property string $assigned_by_id
 * @property CarbonImmutable $assigned_at
 */
#[Fillable([
    'conversation_id',
    'dockable_type',
    'dockable_id',
    'presentation',
    'assigned_by_type',
    'assigned_by_id',
    'assigned_at',
])]
final class DockPlacement extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['assigned_at' => 'immutable_datetime'];
    }

    /**
     * Docks the source in the locked conversation; its caller has found no placement of it there.
     */
    public static function create(
        Conversation $conversation,
        DockIdentity $source,
        string $presentation,
        ActorIdentity $assignedBy,
    ): self {
        $placement = new self([
            'conversation_id' => $conversation->id,
            'dockable_type' => $source->type,
            'dockable_id' => $source->id,
            'presentation' => $presentation,
            'assigned_by_type' => $assignedBy->type->value,
            'assigned_by_id' => $assignedBy->id,
            'assigned_at' => CarbonImmutable::now(),
        ]);

        $placement->assertSaved($placement->save());
        $placement->raise(new DockChanged($conversation->id));

        return $placement;
    }

    // ----------[ Queries ]----------

    /**
     * The placement of the source in the conversation, when it is docked there.
     */
    public static function docked(Conversation $conversation, DockIdentity $source): self|null
    {
        return self::query()->inConversation($conversation)->ofSource($source)->lockForUpdate()->first();
    }

    /**
     * The placement of this id in the conversation, when it still docks this source there.
     */
    public static function matching(Conversation $conversation, string $placementId, DockIdentity $source): self|null
    {
        return self::query()
            ->inConversation($conversation)
            ->ofSource($source)
            ->whereKey($placementId)
            ->lockForUpdate()
            ->first();
    }

    // ----------[ Mutations ]----------

    public function remove(): void
    {
        $this->assertSaved((bool) $this->delete());
        $this->raise(new DockChanged($this->conversation_id));
    }

    /**
     * The presentation to show: the one chosen when the owner still offers it, else the owner's default.
     */
    public function presentationIn(DockDefinition $definition): string
    {
        return in_array($this->presentation, $definition->presentations, true)
            ? $this->presentation
            : DockDefinition::DEFAULT_PRESENTATION;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<DockIdentity, never>
     */
    protected function source(): Attribute
    {
        return Attribute::get(
            fn () => new DockIdentity($this->dockable_type, $this->dockable_id),
        )->withoutObjectCaching();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inConversation(Builder $query, Conversation $conversation): void
    {
        $query->where('conversation_id', $conversation->id);
    }

    /**
     * Placements after the given one in newest-first order; all of them when none is given.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThan(Builder $query, string|null $assignedAt, string|null $placementId): void
    {
        if ($assignedAt === null || $placementId === null) {
            return;
        }

        $query->where(fn (Builder $older) => $older
            ->where('assigned_at', '<', $assignedAt)
            ->orWhere(fn (Builder $same) => $same->where('assigned_at', $assignedAt)->where('id', '<', $placementId)));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSource(Builder $query, DockIdentity $source): void
    {
        $query->where('dockable_type', $source->type)->where('dockable_id', $source->id);
    }
}
