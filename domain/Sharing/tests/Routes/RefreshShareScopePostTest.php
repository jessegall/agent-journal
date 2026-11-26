<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\SharingDomain;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner refreshes what a share shows to a newly saved preview.
 */
#[TestsRoute('POST', 'sharing.refresh-share-scope')]
final class RefreshShareScopePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $document = $journal->owner()->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));
        $root = Document::query()->findOrFail($document->id)->shareIdentity();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $shares = $journal->fixtures(ShareFixtures::class)->grantForADay('Design', $root, $configuration);
        $share = $shares->shareCalled('Design');
        $preview = $journal->run(new SaveSharePreviewCommand($root->type, $root->id, [], $configuration->id));

        return RouteCall::as(Caller::User)
            ->parameters([
                'share' => $share->id,
            ])
            ->headers([
                'Idempotency-Key' => 'share-1',
            ])
            ->payload([
                'previewId' => $preview->previewId,
                'previewChecksum' => $preview->checksum,
            ])
            ->reply(RefreshShareScopeCommand::class, new ShareSummary($share->id, $share->number, ShareStatus::Active))
            ->expects(RefreshShareScopeCommand::class, [
                'shareId' => $share->id,
                'previewId' => $preview->previewId,
                'previewChecksum' => $preview->checksum,
                'requestKey' => 'share-1',
            ]);
    }
}
