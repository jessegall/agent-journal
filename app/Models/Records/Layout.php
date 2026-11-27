<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Web\LayoutRemoved;
use App\Events\Web\LayoutSaved;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Terminals\Data\LayoutShape;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property LayoutShape $shape
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class Layout extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['shape' => LayoutShape::class];
    }

    // ----------[ Constructors ]----------

    /**
     * A layout a user saves under a name.
     */
    public static function create(string $userId, string $name, LayoutShape $shape): self
    {
        $layout = new self();
        $layout->user_id = $userId;
        $layout->name = $name;
        $layout->shape = $shape;
        $layout->saveAndAssert();

        return $layout;
    }

    // ----------[ Mutations ]----------

    /**
     * Saves the layout's new name and shape.
     */
    public function saveNameAndShape(string $name, LayoutShape $shape): void
    {
        $this->name = $name;
        $this->shape = $shape;
        $this->saveAndAssert();
        $this->raise(new LayoutSaved($this->id));
    }

    /**
     * The layout is removed.
     */
    public function remove(): void
    {
        $this->delete();
        $this->raise(new LayoutRemoved($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The layout locked for a change; one of another user's is outside the scope, so it is missing (404).
     */
    public static function findLockedForChange(string $layoutId): self
    {
        return self::query()->whereKey($layoutId)->lockForUpdate()->firstOrFail();
    }

    /**
     * The rows by name.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byName(Builder $query): void
    {
        $query->orderBy('name');
    }
}
