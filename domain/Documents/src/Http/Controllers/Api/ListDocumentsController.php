<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use Domain\Documents\Api\ListDocumentsPayload;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationList;

/**
 * Answers one page of documents.
 */
final readonly class ListDocumentsController
{
    public function __invoke(ListDocumentsPayload $call, DocumentResolver $documents): PublicationList
    {
        return $documents->list(new DocumentFilters(
            attention: $call->attention,
            page: $call->page,
            query: $call->query,
            revisions: $call->revisions,
            after: $call->after,
        ));
    }
}
