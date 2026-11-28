<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Http\Pages\Revisions\RevisionsShow;
use Domain\Documents\Http\Requests\RevisionPageRequest;
use Illuminate\Http\Request;

/**
 * One revision of a document, read by its document and revision numbers.
 */
final readonly class RevisionPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private DocumentResolver $documents,
        private RevisionsShow $page,
    ) {}

    public function build(Request $visit): RevisionPageData
    {
        return RevisionPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(RevisionPageRequest::class, $visit);

        return $this->page->of(
            $this->documents->revision($input->documentNumber(), $input->revisionNumber()),
        );
    }
}
