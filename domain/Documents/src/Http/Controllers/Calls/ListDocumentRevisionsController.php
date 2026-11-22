<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Support\RecordReference;
use Domain\Documents\Calls\ListDocumentRevisionsCall;
use Domain\Documents\Calls\RevisionList;
use Domain\Documents\Contracts\Documents\DocumentResolver;

/**
 * Answers one page of a document's revisions.
 */
final readonly class ListDocumentRevisionsController
{
    public function __invoke(ListDocumentRevisionsCall $call, DocumentResolver $documents): RevisionList
    {
        $revisions = $documents->revisions(RecordReference::number($call->number), $call->page);

        return RevisionList::from(['revisions' => $revisions]);
    }
}
