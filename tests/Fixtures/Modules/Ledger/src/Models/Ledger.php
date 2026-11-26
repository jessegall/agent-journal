<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\HasUlidKey;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * A ledger, numbered across the journal like a task.
 *
 * @property string $id
 * @property string $title
 */
#[Fillable(['title'])]
final class Ledger extends Model implements Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlidKey;
    use Linkable;

    public static function open(string $title): self
    {
        return self::query()->create(['title' => $title]);
    }
}
