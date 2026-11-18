<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Data\RecordText;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;

/**
 * Builds a bounded read of a document revision or a report: its outline, the selected part and the exact
 * continuation.
 */
final class RecordReading
{
    /**
     * A bounded read of a document revision, or of a report, which has one revision only.
     */
    public static function read(string $label, DocumentRevision|Report $record, TextSelection $selection): RecordText
    {
        $revision = $record instanceof DocumentRevision ? $record->number : 1;
        $body = MarkdownText::body($record->body);
        $fields = ['label' => $label, 'revision' => (string) $revision, 'title' => $record->title, 'abstract' => $record->abstract, 'outline' => $body->outlineWithLines()];

        if ($selection->isOutlineOnly()) {
            return RecordText::from($fields);
        }

        $part = $body->part($selection);

        return RecordText::from([...$fields, 'text' => $part->text, 'lines' => "{$part->firstLine}-{$part->lastLine}", ...self::continuationOf($part, $selection, $revision)]);
    }

    /**
     * @return array<string, string>
     */
    private static function continuationOf(TextPart $part, TextSelection $selection, int $revision): array
    {
        if ($part->nextLine === null) {
            return [];
        }

        $end = $selection->lastLine ?? '';

        return ['continuation' => "--lines {$part->nextLine}-{$end} --at-revision {$revision}".($selection->bullets ? ' --bullets' : '').($selection->words !== null ? " --grep \"{$selection->words}\"" : '')];
    }
}
