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
 * A signed-in user reads the first lines of a document's published revision: nothing is sent on.
 */
#[TestsRoute('GET', 'text.read')]
final class ReadGetTest extends GuardedRouteEntryTestCase
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
            'version' => '1',
            'first_line' => 1,
            'last_line' => 2,
        ]);
    }
}
