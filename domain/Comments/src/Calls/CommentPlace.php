<?php

declare(strict_types=1);

namespace Domain\Comments\Calls;

use App\Enums\Records\TextAnchorType;
use App\Values\TextRange;
use Domain\Comments\Exceptions\CommentPlaceUnclear;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Where in one revision of a record a comment points: one section, one span of lines or one quote.
 */
final class CommentPlace extends Data
{
    private const array FIELDS = [
        'version',
        'section',
        'firstLine',
        'lastLine',
        'quote',
        'startOffset',
        'endOffset',
    ];

    public function __construct(
        #[Max(64)]
        public string $version,
        #[Min(1)]
        public int|null $section = null,
        #[MapName('first_line'), Min(1)]
        public int|null $firstLine = null,
        #[MapName('last_line'), Min(1)]
        public int|null $lastLine = null,
        public string|null $quote = null,
        #[MapName('start_offset'), Min(0)]
        public int|null $startOffset = null,
        #[MapName('end_offset'), Min(0)]
        public int|null $endOffset = null,
    ) {}

    /**
     * The text range the fields describe.
     *
     * @throws CommentPlaceUnclear
     */
    public function range(): TextRange
    {
        return match (TextAnchorType::filling($this->givenFields())) {
            TextAnchorType::Section => TextRange::section($this->version, (int) $this->section),
            TextAnchorType::Lines => TextRange::lines($this->version, (int) $this->firstLine, (int) $this->lastLine),
            TextAnchorType::Quote => TextRange::quote(
                $this->version,
                (int) $this->firstLine,
                (int) $this->lastLine,
                (string) $this->quote,
                (int) $this->startOffset,
                (int) $this->endOffset,
            ),
            null => throw CommentPlaceUnclear::given(),
        };
    }

    /**
     * The fields this place fills, in their fixed order.
     *
     * @return list<string>
     */
    private function givenFields(): array
    {
        return array_values(array_filter(self::FIELDS, fn (string $field) => $this->{$field} !== null));
    }
}
