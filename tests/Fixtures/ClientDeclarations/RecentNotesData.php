<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use Spatie\LaravelData\Data;

final class RecentNotesData extends Data
{
    /** @use \App\Web\Creation\Buildable<RecentNotesDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = RecentNotesDataFields::class;

    /**
     * @param  list<string>  $titles
     */
    public function __construct(
        public readonly array $titles,
    ) {}
}
