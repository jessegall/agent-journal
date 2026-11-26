<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Inboxes\Inbox;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToProjectOrGlobal;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Support\Cards\DockIdentity;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Chat\Events\DockChanged;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string|null $project_id
 * @property string $inbox_id
 * @property string $dockable_type
 * @property string $dockable_id
 * @property string $presentation
 * @property string $assigned_by_type
 * @property string $assigned_by_id
 * @property CarbonImmutable $assigned_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $source
 *
 * @mixin \Eloquent
 */
final class DockPlacement extends JournalModel implements EventSource, ProjectOwned, ReadableModel
{
    use BelongsToProjectOrGlobal;
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const int DEFAULT_LIMIT = 50;

    public const int LARGEST_LIMIT = 100;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['assigned_at' => 'immutable_datetime'];
    }

    // ----------[ Constructors ]----------

    /**
     * Docks the source in the locked chat, of the source's project or Global; its caller has found no placement of
     * it there.
     */
    public static function create(
        Inbox $inbox,
        DockIdentity $source,
        ProjectOwner $sourceOwner,
        string $presentation,
        ActorReference $assignedBy,
    ): self {
        $placement = new self();
        $placement->assignOwner($sourceOwner);
        $placement->inbox_id = $inbox->id;
        $placement->dockable_type = $source->type;
        $placement->dockable_id = $source->id;
        $placement->presentation = $presentation;
        $placement->assigned_by_type = $assignedBy->type;
        $placement->assigned_by_id = $assignedBy->id;
        $placement->assigned_at = CarbonImmutable::now();

        $placement->saveAndAssert();
        $placement->raise(new DockChanged($inbox->id));

        return $placement;
    }

    // ----------[ Mutations ]----------

    public function remove(): void
    {
        $this->deleteAndAssert();
        $this->raise(new DockChanged($this->inbox_id));
    }

    /**
     * The presentation to show: the one chosen when the owner still offers it, else the owner's default.
     */
    public function presentationIn(DockDefinition $definition): string
    {
        if (in_array($this->presentation, $definition->presentations, true)) {
            return $this->presentation;
        }

        return DockDefinition::DEFAULT_PRESENTATION;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<DockIdentity, never>
     */
    protected function source(): Attribute
    {
        return Accessor::get(fn () => new DockIdentity($this->dockable_type, $this->dockable_id));
    }

    // ----------[ Queries ]----------

    /**
     * The placement of the source in the chat, when it is docked there.
     */
    public static function findDocked(Inbox $inbox, DockIdentity $source): self|null
    {
        return self::query()->inInbox($inbox)->ofSource($source)->lockForUpdate()->first();
    }

    /**
     * The placement of this id in the chat, when it still docks this source there.
     */
    public static function findMatching(Inbox $inbox, string $placementId, DockIdentity $source): self|null
    {
        return self::query()
            ->inInbox($inbox)
            ->ofSource($source)
            ->whereKey($placementId)
            ->lockForUpdate()
            ->first();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inInbox(Builder $query, Inbox $inbox): void
    {
        $query->where('inbox_id', $inbox->id);
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

    /**
     * The rows by assigned at, then id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byAssignedAt(Builder $query): void
    {
        $query->orderBy('assigned_at');
        $query->orderBy('id');
    }

    /**
     * The rows by assigned at descending, then id descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestAssignedFirst(Builder $query): void
    {
        $query->orderByDesc('assigned_at');
        $query->orderByDesc('id');
    }
}
