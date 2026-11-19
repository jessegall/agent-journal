<?php

declare(strict_types=1);

namespace App\Text\Resolvers;

use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Text\Contracts\TextContent;
use App\Text\Contracts\TextResolver;
use App\Text\Data\TextSections;
use App\Text\Data\TextVersionInfo;
use App\Text\Exceptions\TargetHasNoText;
use App\Text\Exceptions\TextSelectionRefused;
use App\Text\Support\MarkdownText;
use App\Text\Support\TextPart;
use App\Text\Support\TextSelection;
use App\Text\Values\TextVersion;

/**
 * Reads a record's text through the record: it is authorized first, then only the version asked for is loaded.
 */
final readonly class TextRecords implements TextResolver
{
    public function __construct(private RecordResolver $records) {}

    public function version(RecordIdentity $target, string|null $version = null): TextVersionInfo
    {
        $text = $this->textVersion($target, $version);

        return TextVersionInfo::from(['id' => $text->id, 'label' => $text->label, 'lineCount' => $text->lineCount()]);
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
        if ($selection->all) {
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

        return $record instanceof TextContent ? $record->textVersion($version) : throw TargetHasNoText::for($target->type);
    }
}
