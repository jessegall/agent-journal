<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use Spatie\LaravelData\Data;

final class RecentNotesData extends Data
{
    /**
     * @param  list<string>  $titles
     */
    public function __construct(public array $titles) {}
}
