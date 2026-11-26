<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner settles a document at its revision with a reason.
 */
#[TestsRoute('POST', 'documents.settle-document')]
final class SettleDocumentPostTest extends GuardedRouteEntryTestCase
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
            ->parameters([
                'document' => $document->number,
            ])
            ->payload([
                'reason' => 'Built in task 12.',
                'revision' => 1,
            ])
            ->expects(SettleDocumentCommand::class, [
                'documentNumber' => $document->number,
                'expectedRevision' => 1,
                'reason' => 'Built in task 12.',
            ]);
    }
}
