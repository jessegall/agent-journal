<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Resolvers;

use App\Docking\Data\DockablePublicationData;
use App\Navigation\Contracts\PageResolver;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Support\Cards\DockIdentity;
use App\Support\RecordReference;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Http\Pages\Documents\DocumentsShow;
use Domain\Documents\Http\Pages\Resolvers\Support\LibraryListing;
use Domain\Documents\Http\Requests\RecordPageRequest;
use Domain\Documents\Models\Document;
use Domain\Documents\Support\RecordPageReads;

/**
 * A document for its page: the document and its draft's state, and only for the tab the window chose its comments,
 * reads and whether it is shared publicly, its links, its settlements or its first page of revisions. It docks as the
 * document it shows.
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
        private DocumentsShow $page,
        private LibraryListing $library,
    ) {}

    public function read(): DockablePublicationData
    {
        $number = $this->request->documentNumber();
        $document = $this->documents->show($number);
        $identity = $this->records->identify(RecordReference::of('doc', $number));

        $reader = $this->page->of(
            $document,
            $this->drafts->stateOf($number),
            $this->request->chosenTab(),
            fn () => $this->shares->isPubliclyShared($identity),
            fn () => $this->comments->list($identity, $this->request->commentsPage()),
            fn () => $this->reads->of($identity),
            fn () => $this->documents->links($number),
            fn () => $this->documents->inspect($number),
            fn () => $this->documents->revisions($number, 1),
        );

        return DockablePublicationData::of(
            $this->library->layout($reader),
            new DockIdentity(Document::linkType(), $document->id),
        );
    }
}
