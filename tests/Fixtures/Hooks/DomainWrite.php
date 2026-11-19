<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use Illuminate\Database\Eloquent\Model;

/**
 * A row a fixture domain writes inside a hook's transaction, so a test can see whether that write was kept.
 *
 * @property string $name
 */
final class DomainWrite extends Model
{
    public $timestamps = false;

    protected $table = 'domain_writes';

    /**
     * The names of every write kept, in the order they were written.
     *
     * @return list<string>
     */
    public static function names(): array
    {
        return array_values(self::query()->pluck('name')->all());
    }
}
