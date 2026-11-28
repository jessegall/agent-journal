<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;
use App\Web\Enums\NarrowView;
use App\Web\Enums\ReaderWidth;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a split box needs beyond its two sides: the list's width, what a narrow container shows, the reader's
 * largest width and, for a record address, the way back to the list.
 */
#[TypeScript]
final class LayoutSplitData extends Data
{
    /** @use Buildable<LayoutSplitDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutSplitDataFields::class;

    public const int LIST_WIDTH = 430;

    public function __construct(
        public readonly int $listWidth,
        public readonly NarrowView $narrowShows,
        public readonly ReaderWidth $readerWidth,
        public readonly LayoutBackData|Optional $back = new Optional(),
    ) {}
}
