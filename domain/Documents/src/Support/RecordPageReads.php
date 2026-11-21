<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Comments\Contracts\CommentResolver;
use App\Records\Support\RecordIdentity;
use App\Text\Contracts\TextResolver;
use App\Text\Support\TextSelection;
use Domain\Documents\Data\RecordReadsData;
use Domain\Documents\Http\Requests\RecordPageRequest;

/**
 * Reads what a record page asked for beside the record, from its query: a comment's location, a version's sections
 * or a part of its lines. A page that asks for none reads none.
 */
final readonly class RecordPageReads
{
    public function __construct(
        private RecordPageRequest $request,
        private CommentResolver $comments,
        private TextResolver $text,
    ) {}

    public function of(RecordIdentity $record): RecordReadsData
    {
        $reads = [];

        foreach ($this->request->commentIdsToLocate() as $commentId) {
            $reads['commentLocation'] = $this->comments->location($record, $commentId);
        }

        foreach ($this->request->sectionsVersions() as $version) {
            $reads['textSections'] = $this->text->sections($record, $version, 0, $this->request->sectionsPageSize());
        }

        foreach ($this->request->textPartsByVersion() as $version => $selection) {
            $reads['textPart'] = $this->text->read($record, $version, TextSelection::from($selection));
        }

        return RecordReadsData::from($reads);
    }
}
