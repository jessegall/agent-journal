<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Ui\Contracts\PageReader;
use Spatie\LaravelData\Data;

/**
 * A reader that keeps the interface's loose Data return type, which a declaration refuses.
 */
final class LooseReader implements PageReader
{
    public function read(): Data
    {
        return new RecentNotesData([]);
    }
}
