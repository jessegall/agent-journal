<?php

declare(strict_types=1);

namespace App\Text\Values;

use App\Text\Enums\TextAnchorType;
use App\Text\Exceptions\IncompleteTextAnchor;
use App\Text\Support\Section;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A checked, saved place in one version of a text, every field its type needs present: a section with its lines, a
 * span of lines, or a quote with its zero-based UTF-8 byte offsets within those lines, the end exclusive.
 */
#[TypeScript]
final class TextAnchor extends Data
{
    private function __construct(
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

    public static function section(TextVersion $version, Section $section): self
    {
        return new self($version->id, $version->label, TextAnchorType::Section, $section->number, $section->firstLine, $section->lastLine, '', 0, 0);
    }

    public static function lines(TextVersion $version, int $firstLine, int $lastLine): self
    {
        return new self($version->id, $version->label, TextAnchorType::Lines, 0, $firstLine, $lastLine, '', 0, 0);
    }

    public static function quote(TextVersion $version, int $firstLine, int $lastLine, string $quote, int $startOffset, int $endOffset): self
    {
        return new self($version->id, $version->label, TextAnchorType::Quote, 0, $firstLine, $lastLine, $quote, $startOffset, $endOffset);
    }

    /**
     * Where the anchor points, as a person reads it: its version and lines, and its quote when it has one.
     */
    public function description(): string
    {
        $place = "on version {$this->versionLabel}, lines {$this->firstLine}-{$this->lastLine}";

        return $this->quote === '' ? $place : "{$place}: \"{$this->quote}\"";
    }

    /**
     * An anchor read back from storage, refused when a field its type needs is missing.
     *
     * @param  array{versionId?: string|null, versionLabel?: string|null, type?: string|null, sectionNumber?: int|null, firstLine?: int|null, lastLine?: int|null, quote?: string|null, startOffset?: int|null, endOffset?: int|null}  $stored
     *
     * @throws IncompleteTextAnchor
     */
    public static function stored(array $stored): self
    {
        $type = isset($stored['type']) ? TextAnchorType::tryFrom($stored['type']) : null;

        if ($type === null) {
            throw IncompleteTextAnchor::withoutType();
        }

        $field = static fn (string $name): string|int => $stored[$name] ?? throw IncompleteTextAnchor::missing($type->value, $name);

        return match ($type) {
            TextAnchorType::Section => new self((string) $field('versionId'), (string) $field('versionLabel'), $type, (int) $field('sectionNumber'), (int) $field('firstLine'), (int) $field('lastLine'), '', 0, 0),
            TextAnchorType::Lines => new self((string) $field('versionId'), (string) $field('versionLabel'), $type, 0, (int) $field('firstLine'), (int) $field('lastLine'), '', 0, 0),
            TextAnchorType::Quote => new self((string) $field('versionId'), (string) $field('versionLabel'), $type, 0, (int) $field('firstLine'), (int) $field('lastLine'), (string) $field('quote'), (int) $field('startOffset'), (int) $field('endOffset')),
        };
    }
}
