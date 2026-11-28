<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Revisions;

use App\Connections\Layout\LayoutBodyData;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\PublicationPage;
use Domain\Documents\Data\RevisionView;

/**
 * One revision of a document as a publication, read-only: its title, which revision of which document it is, marked
 * historical with a way to the current text when a later one exists, when it was saved, its abstract and its text
 * once; an empty text says so.
 */
final readonly class RevisionsShow extends RevisionsPage
{
    private const string NO_TEXT = '_This revision has no text._';

    public function of(RevisionView $revision): DeclaredLayoutData
    {
        $metadata = [
            LayoutPartData::build()
                ->asText()
                ->key('label')
                ->value("doc {$revision->documentNumber}, revision {$revision->number}")
                ->style('code')
                ->finish(),
            LayoutPartData::build()
                ->asTime()
                ->key('saved')
                ->label('Saved')
                ->detail($revision->closedAt)
                ->finish(),
        ];

        if ($revision->isHistorical) {
            $metadata[] = LayoutPartData::build()
                ->asBadge()
                ->key('historical')
                ->text('Historical')
                ->tone('warn')
                ->finish();
            $current = LayoutActionData::build()->href("/documents/docs/{$revision->documentNumber}")->finish();
            $metadata[] = LayoutPartData::build()
                ->asAction()
                ->key('current')
                ->label('Current text')
                ->action($current)
                ->finish();
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
