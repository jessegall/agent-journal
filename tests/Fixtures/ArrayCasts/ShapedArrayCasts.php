<?php

declare(strict_types=1);

namespace Tests\Fixtures\ArrayCasts;

use Illuminate\Database\Eloquent\Model;

/**
 * A model with one column cast to an array of shapes, which belongs in Data, and two that keep their array cast: a
 * list of strings and a map of ints.
 *
 * @property list<array{name: string, size: int}> $entries
 * @property list<string> $tags
 * @property array<string, int> $counts
 */
final class ShapedArrayCasts extends Model
{
    protected function casts(): array
    {
        return [
            'entries' => 'array',
            'tags' => 'array',
            'counts' => 'array',
        ];
    }
}
