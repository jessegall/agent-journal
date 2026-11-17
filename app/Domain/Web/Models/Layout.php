<?php

declare(strict_types=1);

namespace App\Domain\Web\Models;

use App\Core\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A pane layout a user saved under a name of their own, to restore on Home later: the pane tree and the detached
 * windows as the browser keeps them. Each user sees only their own layouts (rule 4), and a name is used once per user.
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property array<string, mixed> $shape
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'name', 'shape'])]
final class Layout extends Model
{
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['shape' => 'array'];
    }
}
