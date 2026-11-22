<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use Domain\Documents\Calls\ListDocumentsCall;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationList;

/**
 * Answers one page of documents.
 */
final readonly class ListDocumentsController
{
    public function __invoke(ListDocumentsCall $call, DocumentResolver $documents): PublicationList
    {
        return $documents->list(new DocumentFilters(
            attention: $call->attention,
            page: $call->page,
            query: (string) $call->query,
            revisions: $call->revisions,
            after: (string) $call->after,
        ));
    }
}
