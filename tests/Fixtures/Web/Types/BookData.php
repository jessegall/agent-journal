<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BookData extends Data
{
    public function __construct(public readonly string $title) {}
}
