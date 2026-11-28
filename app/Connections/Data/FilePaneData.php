<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Connections\Enums\FileWindowStatus;
use App\Web\Attributes\CopyScoped;
use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\WindowOnly;
use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[WindowOnly, CopyScoped, OptionalProp, Live]
final class FilePaneData extends Data
{
    /** @use Buildable<FilePaneDataFields> */
    use Buildable;

    protected const string FIELDS = FilePaneDataFields::class;

    /** @param list<string> $lines */
    public function __construct(
        public readonly string $path,
        public readonly FileWindowStatus $status,
        public readonly array $lines,
        public readonly bool $isTruncated,
        public readonly string $fullUrl,
    ) {}
}
