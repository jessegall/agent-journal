<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A test, build or other long command line kept under a name, its alias, so an agent runs it as journal <name> or
 * journal run <name>.
 *
 * @property string $id
 * @property string $name
 * @property string $line
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'line'])]
final class CommandAlias extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;
}
