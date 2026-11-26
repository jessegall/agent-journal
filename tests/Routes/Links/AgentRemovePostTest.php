<?php

declare(strict_types=1);

namespace Tests\Routes\Links;

use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Support\RecordIdentity;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Documents\Tests\Fixtures\DocumentFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent removes the link between two documents it may read.
 */
#[TestsRoute('POST', 'links.agent.remove')]
final class AgentRemovePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $documents = $journal->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', 'Owner', 'The design.')
            ->publishedDocument('Spec', 'Owner', 'The spec.');
        $design = $documents->documentCalled('Design');
        $spec = $documents->documentCalled('Spec');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'source' => 'doc '.$design->number,
                'target' => 'doc '.$spec->number,
                'request_key' => 'link-1',
            ])
            ->expects(UnlinkRecordsCommand::class, [
                'source' => new RecordIdentity(Document::linkType(), $design->id),
                'target' => new RecordIdentity(Document::linkType(), $spec->id),
            ]);
    }
}
