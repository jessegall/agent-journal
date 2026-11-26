<?php

declare(strict_types=1);

namespace App\Models\Support;

use Illuminate\Database\Eloquent\Model;

/**
 * The base of every model of the journal: a row keyed by a ULID.
 */
abstract class JournalModel extends Model
{
    use HasUlidKey;
}
