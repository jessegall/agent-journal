<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Casts\LayoutShapeCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Web\LayoutRemoved;
use App\Events\Web\LayoutSaved;
use App\Values\LayoutShape;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A pane layout a user saved under a name of their own, to restore on Home later: the pane tree and the detached
 * windows as the browser keeps them. Each user sees only their own layouts, and a name is used once per user.
 *
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property LayoutShape $shape
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'name',
    'shape',
])]
final class Layout extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['shape' => LayoutShapeCast::class];
    }

    // ----------[ Constructors ]----------

    /**
     * A layout a user saves under a name.
     */
    public static function create(int|string $userId, string $name, LayoutShape $shape): self
    {
        return self::query()->create([
            'user_id' => $userId,
            'name' => $name,
            'shape' => $shape,
        ]);
    }

    // ----------[ Mutations ]----------

    /**
     * Saves the layout's new name and shape.
     */
    public function saveNameAndShape(string $name, LayoutShape $shape): void
    {
        $this->update([
            'name' => $name,
            'shape' => $shape,
        ]);
        $this->raise(new LayoutSaved($this->id));
    }

    public function remove(): void
    {
        $this->delete();
        $this->raise(new LayoutRemoved($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The layout locked for a change; one of another user's is outside the scope, so it is missing (404).
     */
    public static function lockedForChange(string $layoutId): self
    {
        return self::query()->whereKey($layoutId)->lockForUpdate()->firstOrFail();
    }
}
