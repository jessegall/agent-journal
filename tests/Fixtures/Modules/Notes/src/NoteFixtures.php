<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use Tests\Support\Seeding\JournalSeed;

/**
 * A fixture builder of the notes test domain, for the tests of the journal fixture's registry.
 */
final readonly class NoteFixtures
{
    public function __construct(public JournalSeed $journal) {}
}
