<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Text\Support\MarkdownText;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A trusted rich body: HTML made only by the journal's safe Markdown renderer, never handed in by a reader, so a
 * layout carries markup through this one door.
 */
#[TypeScript]
final class LayoutBodyData extends Data
{
    private function __construct(public readonly string $html) {}

    /**
     * The safe HTML of a Markdown text, read from its first line on.
     */
    public static function fromMarkdown(string $markdown): self
    {
        return new self(MarkdownText::body($markdown)->toSafeHtml());
    }
}
