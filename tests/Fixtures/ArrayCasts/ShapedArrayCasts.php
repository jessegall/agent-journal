<?php

declare(strict_types=1);

namespace Tests\Fixtures\ArrayCasts;

use Illuminate\Database\Eloquent\Model;

/**
 * A model with one column cast to an array of shapes, which belongs in Data, one whose type is not stated, and two
 * that keep their array cast: a list of strings and a map of ints.
 *
 * @property array $entries
 * @property array $notes
 * @property array $tags
 * @property array $counts
 */
final class ShapedArrayCasts extends Model
{
    /**
     * @return array<string, string>
     *
     * @column entries list<array{name:string,size:int}>
     * @column tags list<string>
     * @column counts array<string,int>
     */
    protected function casts(): array
    {
        return [
            'entries' => 'array',
            'notes' => 'array',
            'tags' => 'array',
            'counts' => 'array',
        ];
    }
}
