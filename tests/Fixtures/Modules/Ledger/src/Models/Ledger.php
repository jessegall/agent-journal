<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Models;

use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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

    public const string LINK_TYPE = 'ledger.ledger';

    public static function open(string $title): self
    {
        return self::query()->create(['title' => $title]);
    }

}
