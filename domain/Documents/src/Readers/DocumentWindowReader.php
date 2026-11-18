<?php

declare(strict_types=1);

namespace Domain\Documents\Readers;

use App\Agents\Contracts\SessionReader;
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
    public function __construct(private RecordPageRequest $request, private DocumentReader $documents, private DraftReader $drafts, private SessionReader $sessions) {}

    public function read(): DocumentPageData
    {
        $number = $this->request->documentNumber();

        return DocumentPageData::from([
            'number' => (string) $number,
            'record' => RecordPageData::fromDocumentView($this->documents->show($number), $this->documents->comments($number, 1), $this->documents->inspect($number)->settlements, $this->documents->links($number), array_map(DockSession::fromSessionOption(...), $this->sessions->active())),
            'editing' => $this->drafts->stateOf($number),
            'revisions' => $this->documents->revisions($number, 1),
        ]);
    }
}
