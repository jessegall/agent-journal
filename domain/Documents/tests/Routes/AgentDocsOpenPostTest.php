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
 * An agent opens a document to edit it.
 */
#[TestsRoute('POST', 'documents.agent.docs.open')]
final class AgentDocsOpenPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');

        $document = $journal->runAs(
            'Writer',
            new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id),
        );

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'number' => (string) $document->number,
                'expected_revision' => 1,
                'request_key' => 'documents-1',
            ])
            ->reply(OpenDocumentCommand::class, new DraftReference($document->id, $document->number, 'edit-1', 1, 1, [
                '# Design',
            ]))
            ->expects(OpenDocumentCommand::class, [
                'documentNumber' => (string) $document->number,
                'expectedRevision' => 1,
            ]);
    }
}
