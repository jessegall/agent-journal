<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AskPreviewData extends Data
{
    /** @use Buildable<AskPreviewDataFields> */
    use Buildable;

    protected const string FIELDS = AskPreviewDataFields::class;

    public function __construct(
        public readonly string $id,
        public readonly string $excerpt,
        public readonly bool $isOpen,
    ) {}
}
