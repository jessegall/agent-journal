<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Reads\PageFormRequests;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Support\Layout\RecordLayoutData;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Http\Pages\Documents\DocumentsShow;
use Domain\Documents\Http\Pages\Support\LibraryListing;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Models\Document;
use Domain\Documents\Support\RecordPageReads;
use Illuminate\Http\Request;

/**
 * A document for its page: the document and its draft's state, and only for the tab the window chose its comments,
 * reads and whether it is shared publicly, its links, its settlements or its first page of revisions. It docks as the
 * document it shows.
 */
final readonly class DocumentPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private DocumentResolver $documents,
        private DraftResolver $drafts,
        private CommentResolver $comments,
        private RecordResolver $records,
        private ShareStatusResolver $shares,
        private RecordPageReads $reads,
        private DocumentsShow $page,
        private LibraryListing $library,
    ) {}

    public function build(Request $visit): DocumentPageData
    {
        return DocumentPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): RecordLayoutData
    {
        $input = $this->requests->forVisit(RecordPageRequest::class, $visit);

        $number = $input->documentNumber();
        $document = $this->documents->show($number);
        $identity = $this->records->identify(RecordReference::of('doc', $number));

        $reader = $this->page->of(
            $document,
            $this->drafts->stateOf($number),
            $input->chosenTab(),
            fn () => $this->shares->isPubliclyShared($identity),
            fn () => $this->comments->list($identity, $input->commentsPage()),
            fn () => $this->reads->of($identity),
            fn () => $this->documents->links($number),
            fn () => $this->documents->inspect($number),
            fn () => $this->documents->revisions($number, 1),
        );

        return RecordLayoutData::build()
            ->shown($this->library->layout($input->filters(), $input->typeFilter(), $reader))
            ->record(new RecordIdentity(Document::linkType(), $document->id))
            ->finish();
    }
}
