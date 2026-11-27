<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent reads the draft it holds of a document.
 */
#[TestsRoute('POST', 'documents.agent.docs.draft')]
final class AgentDocsDraftPostTest extends GuardedRouteEntryTestCase
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

        $opened = $journal->runAs('Writer', new OpenDocumentCommand((string) $document->number));

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['number' => (string) $document->number]);
    }
}
