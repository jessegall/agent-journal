<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\SharingDomain;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner saves the preview of sharing a record with the linked records chosen.
 */
#[TestsRoute('POST', 'sharing.save-share-preview')]
final class SaveSharePreviewPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $document = $journal->owner()->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $root = Document::query()->findOrFail($document->id)->shareIdentity();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $preview = $journal->run(new SaveSharePreviewCommand($root->type, $root->id, [], $configuration->id));

        return RouteCall::as(Caller::User)
            ->parameters(['reference' => "doc {$document->number}"])
            ->payload(['selected' => []])
            ->reply(SaveSharePreviewCommand::class, $preview)
            ->expects(SaveSharePreviewCommand::class, [
                'rootType' => $root->type,
                'rootId' => $root->id,
                'selectedIds' => [],
            ]);
    }
}
