<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Sharing\SharingDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST sharing.make-share-gateway-default, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'sharing.make-share-gateway-default')]
final class MakeShareGatewayDefaultPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST sharing.make-share-gateway-default', [
            '{configuration}',
            'the payload',
            'the expected commands',
        ]);
    }
}
