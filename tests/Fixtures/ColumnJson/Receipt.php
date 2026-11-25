<?php

declare(strict_types=1);

namespace Tests\Fixtures\ColumnJson;

use Illuminate\Database\Eloquent\Model;

/**
 * A model that writes a column's JSON by hand, which is refused, beside a digest of JSON, which passes.
 *
 * @property string $lines
 */
final class Receipt extends Model
{
    /**
     * @param  list<string>  $lines
     */
    public function keep(array $lines): void
    {
        $this->lines = json_encode($lines, JSON_THROW_ON_ERROR);
    }

    /**
     * @param  list<string>  $lines
     */
    public static function digestOf(array $lines): string
    {
        return hash('sha256', json_encode($lines, JSON_THROW_ON_ERROR));
    }
}
