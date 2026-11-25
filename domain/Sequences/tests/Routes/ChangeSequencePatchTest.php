<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Routes;

use Domain\Sequences\SequencesDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of PATCH sequences.change-sequence, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('PATCH', 'sequences.change-sequence')]
final class ChangeSequencePatchTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SequencesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('PATCH sequences.change-sequence', [
            '{sequence}',
            'the payload',
            'the expected commands',
        ]);
    }
}
