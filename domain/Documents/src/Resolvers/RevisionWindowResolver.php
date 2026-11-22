<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutBodyData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\PublicationPage;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Http\Requests\RevisionPageRequest;

/**
 * One revision of a document as a publication, read-only: its title, which revision of which document it is, marked
 * historical with a way to the current text when a later one exists, when it was saved, its abstract and its text
 * once; an empty text says so.
 */
final readonly class RevisionWindowResolver implements PageResolver
{
    private const string NO_TEXT = '_This revision has no text._';

    public function __construct(private RevisionPageRequest $request, private DocumentResolver $documents) {}

    public function read(): DeclaredLayoutData
    {
        $revision = $this->documents->revision($this->request->documentNumber(), $this->request->revisionNumber());
        $metadata = [
            LayoutPartData::text('label', "doc {$revision->documentNumber}, revision {$revision->number}", 'code'),
            LayoutPartData::text('saved', "Saved {$revision->closedAt}", 'muted'),
        ];

        if ($revision->historical) {
            $metadata[] = LayoutPartData::badge('historical', 'Historical', 'warn');
            $current = LayoutActionData::to("/documents/docs/{$revision->documentNumber}");
            $metadata[] = LayoutPartData::action('current', 'Current text', $current);
        }

        return PublicationPage::make(
            $revision->title,
            $metadata,
            $revision->abstract,
            fn () => LayoutBodyData::fromMarkdown(trim($revision->body) === '' ? self::NO_TEXT : $revision->body),
            [],
        )->layout('');
    }
}
