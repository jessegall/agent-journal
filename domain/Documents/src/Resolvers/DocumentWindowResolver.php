<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Comments\Contracts\CommentResolver;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Ui\Contracts\PageResolver;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Data\DocumentPageData;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Support\RecordPageReads;

/**
 * One document's page: its current revision rendered to safe HTML, and its draft.
 */
final readonly class DocumentWindowResolver implements PageResolver
{
    public function __construct(
        private RecordPageRequest $request,
        private DocumentResolver $documents,
        private DraftResolver $drafts,
        private CommentResolver $comments,
        private RecordResolver $records,
        private ShareStatusResolver $shares,
        private RecordPageReads $reads,
    ) {}

    public function read(): DocumentPageData
    {
        $number = $this->request->documentNumber();
        $identity = $this->records->identify(RecordReference::of('doc', $number));

        return DocumentPageData::from([
            'number' => (string) $number,
            'record' => RecordPageData::fromDocumentView(
                $this->documents->show($number),
                $this->comments->list($identity, $this->request->commentsPage()),
                $this->documents->inspect($number)->settlements,
                $this->documents->links($number),
                $this->shares->isPubliclyShared($identity),
                $this->reads->of($identity),
            ),
            'editing' => $this->drafts->stateOf($number),
            'revisions' => $this->documents->revisions($number, 1),
        ]);
    }
}
