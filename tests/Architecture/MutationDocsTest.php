<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ProjectModels;
use Tests\Architecture\Support\UndocumentedMutationScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every public mutation of a model says in one or two lines what it does, so its doc comment is read before its body.
 */
#[TimeLimit(seconds: 20, reason: 'It parses every model of the app and the domains.')]
final class MutationDocsTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/MutationDocs/FixtureLetter.php';

    private const string HOW_TO_FIX = "Give each of these mutations a doc comment of one or two lines that says what it does:\n";

    public function test_every_model_mutation_says_in_one_or_two_lines_what_it_does(): void
    {
        $undocumented = ScanCache::findings(new UndocumentedMutationScan(), ProjectModels::files());

        $this->assertSame([], $undocumented, self::HOW_TO_FIX.implode("\n", $undocumented));
    }

    public function test_a_mutation_without_a_doc_comment_or_with_a_long_one_is_found(): void
    {
        $this->journal->assertResult(
            ['FixtureLetter::send', 'FixtureLetter::archive'],
            ScanCache::findings(new UndocumentedMutationScan(), [base_path(self::FIXTURE)]),
        );
    }
}
