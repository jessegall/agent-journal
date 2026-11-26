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
use Tests\Support\TestProjects;

/**
 * The owner reads the comments list.
 */
#[TestsRoute('GET', 'comments.list')]
final class ListGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        $document = $journal->run(
            new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id),
        );

        return RouteCall::as(Caller::User)->query(['target' => "doc {$document->number}"]);
    }
}
