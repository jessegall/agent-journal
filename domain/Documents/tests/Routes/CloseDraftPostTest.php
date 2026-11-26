<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Values\CloseResult;
use Domain\Documents\Values\DraftTarget;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner closes the draft they hold of a document.
 */
#[TestsRoute('POST', 'documents.close-draft')]
final class CloseDraftPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $document = $journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $opened = $journal->run(new OpenDocumentCommand((string) $document->number));

        return RouteCall::as(Caller::User)
            ->parameters([
                'document' => $document->number,
            ])
            ->payload([
                'token' => $opened->token,
                'version' => $opened->version,
            ])
            ->reply(CloseDocumentCommand::class, new CloseResult(2, true))
            ->expects(CloseDocumentCommand::class, [
                'draft' => new DraftTarget((string) $document->number, $opened->token, $opened->version),
            ]);
    }
}
