<?php

declare(strict_types=1);

namespace App\Text\Values;

use App\Text\Enums\TextAnchorType;
use App\Text\Exceptions\AnchorMismatch;
use App\Text\Exceptions\InvalidTextRange;

/**
 * Where a caller asks to point in a version of a text: a section, a span of lines, or an exact quote. It is checked
 * against the version once, and only then becomes a saved TextAnchor.
 */
final readonly class TextRange
{
    public const int QUOTE_BYTES = 16_384;

    private function __construct(
        public string $version,
        public TextAnchorType $type,
        public int $sectionNumber,
        public int $firstLine,
        public int $lastLine,
        public string $quote,
        public int $startOffset,
        public int $endOffset,
    ) {}

    public static function section(string $version, int $number): self
    {
        return new self($version, TextAnchorType::Section, $number, 0, 0, '', 0, 0);
    }

    public static function lines(string $version, int $firstLine, int $lastLine): self
    {
        return new self($version, TextAnchorType::Lines, 0, $firstLine, $lastLine, '', 0, 0);
    }

    public static function quote(
        string $version,
        int $firstLine,
        int $lastLine,
        string $quote,
        int $startOffset,
        int $endOffset,
    ): self {
        return new self($version, TextAnchorType::Quote, 0, $firstLine, $lastLine, $quote, $startOffset, $endOffset);
    }

    /**
     * The saved anchor of this range in the version, refused by name when any part does not hold: no clamping and
     * no search for the quote elsewhere.
     *
     * @throws InvalidTextRange|AnchorMismatch
     */
    public function anchorIn(TextVersion $version): TextAnchor
    {
        if ($version->id !== $this->version) {
            throw InvalidTextRange::otherVersion($this->version, $version->id);
        }

        return match ($this->type) {
            TextAnchorType::Section => $this->sectionAnchorIn($version),
            TextAnchorType::Lines => TextAnchor::lines($version, ...$this->checkedLines($version)),
            TextAnchorType::Quote => $this->quoteAnchorIn($version),
        };
    }

    private function sectionAnchorIn(TextVersion $version): TextAnchor
    {
        if (! $version->hasSection($this->sectionNumber)) {
            throw InvalidTextRange::noSection($this->sectionNumber);
        }

        $section = $version->sections[$this->sectionNumber - 1];

        return TextAnchor::section($version, $section);
    }

    /**
     * @return array{int, int}
     */
    private function checkedLines(TextVersion $version): array
    {
        if ($this->firstLine < 1 || $this->lastLine < $this->firstLine || $this->lastLine > $version->lineCount()) {
            throw InvalidTextRange::badLines($this->firstLine, $this->lastLine, $version->lineCount());
        }

        return [$this->firstLine, $this->lastLine];
    }

    private function quoteAnchorIn(TextVersion $version): TextAnchor
    {
        [$first, $last] = $this->checkedLines($version);
        $window = $version->lines($first, $last);

        if ($this->quote === '' || strlen($this->quote) > self::QUOTE_BYTES) {
            throw InvalidTextRange::badQuoteLength(self::QUOTE_BYTES);
        }

        if ($this->startOffset < 0 || $this->endOffset <= $this->startOffset || $this->endOffset > strlen($window)) {
            throw InvalidTextRange::badOffsets($this->startOffset, $this->endOffset);
        }

        $quoted = substr($window, $this->startOffset, $this->endOffset - $this->startOffset);

        if (! mb_check_encoding($quoted, 'UTF-8')) {
            throw InvalidTextRange::splitCharacter();
        }

        if ($quoted !== $this->quote) {
            throw AnchorMismatch::inVersion($version->label, $first, $last);
        }

        return TextAnchor::quote($version, $first, $last, $this->quote, $this->startOffset, $this->endOffset);
    }
}
