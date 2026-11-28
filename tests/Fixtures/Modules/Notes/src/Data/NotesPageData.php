<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Data;

use Spatie\LaravelData\Data;

/**
 * The notes the calling actor may see, by their text.
 */
final class NotesPageData extends Data
{
    /** @use \App\Web\Creation\Buildable<NotesPageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = NotesPageDataFields::class;

    /**
     * @param  list<string>  $texts
     */
    public function __construct(
        public readonly array $texts,
    ) {}
}
