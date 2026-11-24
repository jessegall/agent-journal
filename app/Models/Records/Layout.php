<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
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
 * @property array<string, mixed> $shape
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'name', 'shape'])]
final class Layout extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['shape' => 'array'];
    }

    /**
     * A layout a user saves under a name.
     *
     * @param  array<string, mixed>  $shape
     */
    public static function create(int|string $userId, string $name, array $shape): self
    {
        return self::query()->create(['user_id' => $userId, 'name' => $name, 'shape' => $shape]);
    }

    // ----------[ Mutations ]----------

    /**
     * Saves the layout's new name and shape.
     *
     * @param  array<string, mixed>  $shape
     */
    public function saveNameAndShape(string $name, array $shape): void
    {
        $this->update(['name' => $name, 'shape' => $shape]);
    }
}
