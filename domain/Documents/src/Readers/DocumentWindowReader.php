<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Agents\Contracts\SessionReader;
use App\Assignments\Support\Page;
use App\Comments\Contracts\CommentReader;
use App\Numbers\Support\RecordReference;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordReader;
use App\Sharing\Contracts\ShareStatusReader;
use App\Ui\Contracts\PageReader;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Data\DockSession;
use Domain\Documents\Data\DocumentPageData;
use Domain\Documents\Data\RecordPageData;
use Domain\Documents\Http\Requests\RecordPageRequest;

/**
 * One document's page: its current revision rendered to safe HTML, and its draft.
 */
final readonly class DocumentWindowReader implements PageReader
{
    public function __construct(private RecordPageRequest $request, private DocumentReader $documents, private DraftReader $drafts, private SessionReader $sessions, private CommentReader $comments, private RecordReader $records, private ShareStatusReader $shares) {}

    public function read(): DocumentPageData
    {
        $number = $this->request->documentNumber();
        $identity = $this->records->identify(RecordReference::of('doc', $number));

        return DocumentPageData::from([
            'number' => (string) $number,
            'record' => RecordPageData::fromDocumentView($this->documents->show($number), $this->comments->list($identity, new Page(null, PageSize::from(null)->rows)), $this->documents->inspect($number)->settlements, $this->documents->links($number), array_map(DockSession::fromSessionOption(...), $this->sessions->active()), $this->shares->isPubliclyShared($identity)),
            'editing' => $this->drafts->stateOf($number),
            'revisions' => $this->documents->revisions($number, 1),
        ]);
    }
}
