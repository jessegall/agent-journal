<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Values\DraftTarget;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner saves the draft's details and body.
 */
#[TestsRoute('POST', 'documents.save-draft')]
final class SaveDraftPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $document = $journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));
        $opened = $journal->run(new OpenDocumentCommand((string) $document->number));

        return RouteCall::as(Caller::User)
            ->parameters([
                'document' => $document->number,
            ])
            ->payload([
                'token' => $opened->token,
                'version' => $opened->version,
                'title' => 'Design',
                'abstract' => 'The plan, revised.',
                'body' => "# Design\nNew text.",
            ])
            ->reply(ChangeDocumentDetailsCommand::class, $opened)
            ->reply(ReplaceDocumentBodyCommand::class, $opened)
            ->expects(ChangeDocumentDetailsCommand::class, [
                'draft' => new DraftTarget((string) $document->number, $opened->token, $opened->version),
                'title' => 'Design',
                'abstract' => 'The plan, revised.',
            ])
            ->expects(ReplaceDocumentBodyCommand::class, [
                'draft' => $opened->target(),
                'body' => "# Design\nNew text.",
            ]);
    }
}
