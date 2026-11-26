<?php

declare(strict_types=1);

namespace App\Values;

use App\Records\Enums\TextAnchorType;
use App\Text\Section;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A checked, saved place in one version of a text, every field its type needs present: a section with its lines, a
 * span of lines, or a quote with its zero-based UTF-8 byte offsets within those lines, the end exclusive.
 */
#[TypeScript]
final class TextAnchor extends Data
{
    public function __construct(
        public readonly string $versionId,
        public readonly string $versionLabel,
        public readonly TextAnchorType $type,
        public readonly int $sectionNumber,
        public readonly int $firstLine,
        public readonly int $lastLine,
        public readonly string $quote,
        public readonly int $startOffset,
        public readonly int $endOffset,
    ) {}

    /**
     * An anchor rebuilt from the parts it was stored with.
     */
    public static function restored(
        string $versionId,
        string $versionLabel,
        TextAnchorType $type,
        int $sectionNumber,
        int $firstLine,
        int $lastLine,
        string $quote,
        int $startOffset,
        int $endOffset,
    ): self {
        return new self(
            $versionId,
            $versionLabel,
            $type,
            $sectionNumber,
            $firstLine,
            $lastLine,
            $quote,
            $startOffset,
            $endOffset,
        );
    }

    public static function section(TextVersion $version, Section $section): self
    {
        return new self(
            $version->id,
            $version->label,
            TextAnchorType::Section,
            $section->number,
            $section->firstLine,
            $section->lastLine,
            '',
            0,
            0,
        );
    }

    public static function lines(TextVersion $version, int $firstLine, int $lastLine): self
    {
        return new self($version->id, $version->label, TextAnchorType::Lines, 0, $firstLine, $lastLine, '', 0, 0);
    }

    public static function quote(
        TextVersion $version,
        int $firstLine,
        int $lastLine,
        string $quote,
        int $startOffset,
        int $endOffset,
    ): self {
        return new self(
            $version->id,
            $version->label,
            TextAnchorType::Quote,
            0,
            $firstLine,
            $lastLine,
            $quote,
            $startOffset,
            $endOffset,
        );
    }

    /**
     * Where the anchor points, as a user reads it: its version and lines, and its quote when it has one.
     */
    public function description(): string
    {
        $place = "on version {$this->versionLabel}, lines {$this->firstLine}-{$this->lastLine}";

        if ($this->quote === '') {
            return $place;
        }

        return "{$place}: \"{$this->quote}\"";
    }
}
