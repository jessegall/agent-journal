<?php

declare(strict_types=1);

namespace Tests\Routes\Sharing;

use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Commands\RevokeShare\RevokeShareCommand;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\ShareSummary;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestProjects;

/**
 * The owner revokes a share.
 */
#[TestsRoute('DELETE', 'sharing.revoke-share')]
final class RevokeShareDeleteTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $document = $journal->owner()->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $root = Document::query()->findOrFail($document->id)->shareIdentity();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $journal->shareForADay('Design', $root, $configuration);
        $share = $journal->shareCalled('Design');

        return RouteCall::as(Caller::User)
            ->parameters(['share' => $share->id])
            ->headers(['Idempotency-Key' => 'share-1'])
            ->reply(RevokeShareCommand::class, new ShareSummary($share->id, $share->number, ShareStatus::Active))
            ->expects(RevokeShareCommand::class, ['shareId' => $share->id, 'requestKey' => 'share-1']);
    }
}
