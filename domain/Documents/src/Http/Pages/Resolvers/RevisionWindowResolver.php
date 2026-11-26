<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers;

use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Http\Pages\Revisions\RevisionsShow;
use Domain\Documents\Http\Requests\RevisionPageRequest;

/**
 * One revision of a document, read by its document and revision numbers.
 */
final readonly class RevisionWindowResolver implements PageResolver
{
    public function __construct(
        private RevisionPageRequest $request,
        private DocumentResolver $documents,
        private RevisionsShow $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        return $this->page->of(
            $this->documents->revision($this->request->documentNumber(), $this->request->revisionNumber()),
        );
    }
}
