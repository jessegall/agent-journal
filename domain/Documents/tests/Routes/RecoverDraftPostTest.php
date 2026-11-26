<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\RecoverDocument\RecoverDocumentCommand;
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
 * The owner recovers the draft of a document with a reason.
 */
#[TestsRoute('POST', 'documents.recover-draft')]
final class RecoverDraftPostTest extends GuardedRouteEntryTestCase
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
            ->parameters(['document' => $document->number])
            ->payload(['token' => $opened->token, 'version' => $opened->version, 'reason' => 'The session ended.'])
            ->reply(RecoverDocumentCommand::class, new CloseResult(2, true))
            ->expects(RecoverDocumentCommand::class, [
                'draft' => new DraftTarget((string) $document->number, $opened->token, $opened->version),
                'reason' => 'The session ended.',
            ]);
    }
}
