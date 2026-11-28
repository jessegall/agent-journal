<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\SummaryProvider;
use App\Records\Values\RecordSummary;
use App\Records\Values\SummaryLine;
use App\Values\ProjectOwner;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Notes as a short card shows them, its text and the word Note: one read by its id, and a batch in one query; the
 * global scope decides which notes a viewer of the fixture may read.
 */
final readonly class NoteSummaries implements SummaryProvider
{
    public function requireReadable(string $id): RecordSummary
    {
        return self::summary(
            Note::query()->whereKey($id)->firstOr(RecordUnavailable::throwing()->forModel(Note::class, $id)),
        );
    }

    public function ownerOf(string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function visibleSummaries(array $ids): array
    {
        $notes = Note::query()->whereKey($ids)->get();

        return array_values($notes->map(self::summary(...))->all());
    }

    private static function summary(Note $note): RecordSummary
    {
        return new RecordSummary($note->id, $note->text, lines: [new SummaryLine('kind', 'Note')]);
    }
}
