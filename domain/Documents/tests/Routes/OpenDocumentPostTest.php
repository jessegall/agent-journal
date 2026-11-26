<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Values\DraftReference;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner opens a document to edit it.
 */
#[TestsRoute('POST', 'documents.open-document')]
final class OpenDocumentPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $document = $journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));

        return RouteCall::as(Caller::User)
            ->parameters(['document' => $document->number])
            ->reply(OpenDocumentCommand::class, new DraftReference($document->id, $document->number, 'edit-1', 1, 1, [
                '# Design',
            ]))
            ->expects(OpenDocumentCommand::class, ['documentNumber' => (string) $document->number]);
    }
}
