<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\MarkdownText;
use App\Support\TextSelection;
use App\Text\TextReading;
use Domain\Documents\Data\RecordText;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;

/**
 * Builds a bounded read of a document revision or a report: its outline, the selected part and the exact
 * continuation.
 */
final class RecordTextReader
{
    /**
     * A bounded read of a document revision, or of a report, which has one revision only.
     */
    public static function read(string $label, DocumentRevision|Report $record, TextSelection $selection): RecordText
    {
        $revision = $record instanceof DocumentRevision ? $record->number : 1;
        $body = MarkdownText::body($record->body);

        $fields = [
            'label' => $label,
            'revision' => (string) $revision,
            'title' => $record->title,
            'abstract' => $record->abstract,
            'outline' => $body->outlineWithLines(),
        ];

        if ($selection->isOutlineOnly()) {
            return RecordText::from($fields);
        }

        return RecordText::from([...$fields, ...TextReading::read($body, $selection, $revision)]);
    }
}
