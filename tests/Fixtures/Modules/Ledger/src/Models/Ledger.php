<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Models;

use App\Concerns\Linkable;
use App\Contracts\Records\Numbered;
use App\Concerns\HasNumber;
use App\Contracts\Records\ReadableModel;
use App\Concerns\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
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
    use HasUlids;
    use Linkable;

    public static function open(string $title): self
    {
        return self::query()->create(['title' => $title]);
    }

}
