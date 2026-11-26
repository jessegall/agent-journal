<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Routes;

use Domain\Comments\CommentsDomain;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent lists the comments on a record.
 */
#[TestsRoute('POST', 'comments.agent.list')]
final class AgentListPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'target' => "doc {$document->number}",
            ]);
    }
}
