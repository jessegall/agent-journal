<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Data;

use Spatie\LaravelData\Data;

/**
 * The notes the calling actor may see, by their text.
 */
final class NotesPageData extends Data
{
    /**
     * @param  list<string>  $texts
     */
    public function __construct(public readonly array $texts) {}
}
