<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Contracts\Navigation\PageResolver;
use Spatie\LaravelData\Data;

/**
 * A reader that keeps the interface's loose Data return type, which a declaration refuses.
 */
final class LooseResolver implements PageResolver
{
    public function read(): Data
    {
        return new RecentNotesData([]);
    }
}
