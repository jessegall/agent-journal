<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types\Shelves;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ShelfData extends Data
{
    use ShelfProperties;
}
