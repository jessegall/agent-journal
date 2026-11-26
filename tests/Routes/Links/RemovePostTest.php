<?php

declare(strict_types=1);

namespace Tests\Routes\Links;

use App\Links\Commands\UnlinkRecords\UnlinkRecordsCommand;
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
 * The owner removes the link between two documents.
 */
#[TestsRoute('POST', 'links.remove')]
final class RemovePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $documents = $journal->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', 'Owner', 'The design.')
            ->publishedDocument('Spec', 'Owner', 'The spec.');
        $design = $documents->documentCalled('Design');
        $spec = $documents->documentCalled('Spec');

        return RouteCall::as(Caller::User)
            ->payload([
                'source' => 'doc '.$design->number,
                'target' => 'doc '.$spec->number,
            ])
            ->expects(UnlinkRecordsCommand::class, [
                'source' => new RecordIdentity(Document::linkType(), $design->id),
                'target' => new RecordIdentity(Document::linkType(), $spec->id),
            ]);
    }
}
