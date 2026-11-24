<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Reads\TextContent;
use App\Contracts\Reads\TextResolver;
use App\Contracts\Records\RecordResolver;
use App\Data\Pages\TextSections;
use App\Data\Pages\TextVersionSummary;
use App\Exceptions\TargetHasNoText;
use App\Exceptions\TextSelectionRefused;
use App\Support\MarkdownText;
use App\Support\RecordIdentity;
use App\Support\TextPart;
use App\Support\TextSelection;
use App\Values\PageSize;
use App\Values\TextVersion;

/**
 * Reads a record's text through the record: it is authorized first, then only the version asked for is loaded.
 */
final readonly class TextRecords implements TextResolver
{
    public function __construct(private RecordResolver $records) {}

    public function version(RecordIdentity $target, string|null $version = null): TextVersionSummary
    {
        $text = $this->textVersion($target, $version);

        return TextVersionSummary::from([
            'id' => $text->id,
            'label' => $text->label,
            'lineCount' => $text->lineCount(),
        ]);
    }

    public function sections(RecordIdentity $target, string $version, int $afterSection, PageSize $size): TextSections
    {
        $after = array_values(
            array_filter(
                $this->textVersion($target, $version)->sections,
                fn ($section) => $section->number > $afterSection,
            ),
        );

        $page = array_slice($after, 0, $size->rows);

        return TextSections::from(
            [
                'items' => $page,
                'nextAfterSection' => count($after) > $size->rows ? $page[$size->rows - 1]->number : null,
            ],
        );
    }

    public function read(RecordIdentity $target, string $version, TextSelection $selection): TextPart
    {
        if ($selection->isWholeText) {
            throw TextSelectionRefused::unbounded();
        }

        if ($selection->bullets || $selection->words !== null) {
            throw TextSelectionRefused::filtered();
        }

        return MarkdownText::body($this->textVersion($target, $version)->text)->part($selection);
    }

    private function textVersion(RecordIdentity $target, string|null $version): TextVersion
    {
        $record = $this->records->requireReadable($target);

        return $record instanceof TextContent
            ? $record->textVersion($version)
            : throw TargetHasNoText::for($target->type);
    }
}
