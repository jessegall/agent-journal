<?php

declare(strict_types=1);

namespace Tests\Routes\Text;

use Domain\Documents\DocumentsDomain;
use Domain\Documents\Tests\Fixtures\DocumentFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user reads which revision of a document is current: nothing is sent on.
 */
#[TestsRoute('GET', 'text.version')]
final class VersionGetTest extends GuardedRouteEntryTestCase
{
    private const string BODY = "# Plan\n\nFirst line.\nSecond line.\n";

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $document = $journal->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', 'Owner', self::BODY)
            ->documentCalled('Design');

        return RouteCall::as(Caller::User)->query([
            'target' => 'doc '.$document->number,
        ]);
    }
}
