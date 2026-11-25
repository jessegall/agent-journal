<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Enums\Web\NarrowView;
use App\Enums\Web\ReaderWidth;
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
    public const int LIST_WIDTH = 430;

    public function __construct(
        public readonly int $listWidth,
        public readonly NarrowView $narrowShows,
        public readonly ReaderWidth $readerWidth,
        public readonly LayoutBackData|Optional $back = new Optional(),
    ) {}

    /**
     * The split of an index address: the list alone in a narrow container.
     */
    public static function showingList(ReaderWidth $readerWidth = ReaderWidth::Unrestricted): self
    {
        return new self(self::LIST_WIDTH, NarrowView::List, $readerWidth);
    }

    /**
     * The split of a record address: the reader alone in a narrow container, with Back to its list.
     */
    public static function showingReader(LayoutBackData $back, ReaderWidth $width = ReaderWidth::Unrestricted): self
    {
        return new self(self::LIST_WIDTH, NarrowView::Reader, $width, $back);
    }
}
