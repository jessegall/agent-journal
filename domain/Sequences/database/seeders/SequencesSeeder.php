<?php

declare(strict_types=1);

namespace Domain\Sequences\Database\Seeders;

use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Values\SequenceStep;
use Illuminate\Database\Seeder;

/**
 * A local sequence of three steps, so the running app shows a sequence row and its reader. Once seeded, seeding again
 * adds nothing.
 */
final class SequencesSeeder extends Seeder
{
    private const string NAME = 'Release a version';

    public function run(): void
    {
        if (Sequence::query()->where('name', self::NAME)->exists()) {
            return;
        }

        Sequence::create(self::NAME, 'The steps of a release, from the suite to the tag.', [
            new SequenceStep('test', 'Run the full suite', 'a release is due', 'every test passes'),
            new SequenceStep('notes', 'Write the release notes', 'the suite passed', 'the notes name every change'),
            new SequenceStep('tag', 'Tag the release', 'the notes are written', 'the tag is pushed'),
        ]);
    }
}
