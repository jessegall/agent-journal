<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Tests\Fixtures;

use Tests\Support\Seeding\TestJournal;

/**
 * A fixture builder of the notes test domain, for the tests of the journal fixture's registry.
 */
final readonly class NoteFixtures
{
    public function __construct(public TestJournal $journal) {}
}
