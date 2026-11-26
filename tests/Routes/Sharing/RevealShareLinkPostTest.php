<?php

declare(strict_types=1);

namespace Tests\Routes\Sharing;

use App\Models\Sharing\ShareGatewayConfiguration;
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
 * The owner reveals the link of a share.
 */
#[TestsRoute('POST', 'sharing.reveal-share-link')]
final class RevealShareLinkPostTest extends GuardedRouteEntryTestCase
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

        $journal->shareForADay('Design', $root, $configuration)
            ->activateShare('Design');

        $share = $journal->shareCalled('Design');

        return RouteCall::as(Caller::User)
            ->parameters(['share' => $share->id]);
    }
}
