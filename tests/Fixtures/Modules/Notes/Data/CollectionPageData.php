<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Data;

use Spatie\LaravelData\Data;

/**
 * One collection of notes, named by its month, with the notes written in it.
 */
final class CollectionPageData extends Data
{
    /**
     * @param  list<string>  $texts
     */
    public function __construct(
        public readonly string $collection,
        public readonly array $texts,
    ) {}
}
