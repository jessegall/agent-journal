<?php

declare(strict_types=1);

namespace App\Domain\Processes\Models;

use App\Domain\Links\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A test, build or other long command saved under a name, so an agent runs it as journal <name> or journal run <name>.
 *
 * @property int $id
 * @property string $name
 * @property string $line
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'line'])]
final class SavedCommand extends Model
{
    use Linkable;
}
