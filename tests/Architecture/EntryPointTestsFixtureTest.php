<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\EntryPoints\EntryTestFindings;
use Tests\Architecture\Support\EntryPoints\EntryType;
use Tests\Architecture\Support\EntryPoints\LoaderEntries;
use Tests\Architecture\Support\EntryPoints\NamedEntry;
use Tests\Fixtures\EntryPointTests\TestedRead;
use Tests\Fixtures\EntryPointTests\UntestedRead;

/**
 * The entry test findings on the fixture reads: a read no test names is listed with the path to write its test at,
 * and a read test outside the reads folder with the folder to move it to.
 */
final class EntryPointTestsFixtureTest extends TestCase
{
    public function test_a_read_with_no_test_and_a_read_test_in_the_wrong_folder_are_listed(): void
    {
        $misplacedTest = new NamedEntry(
            'tests/Feature/TestedReadTest.php',
            'TestedReadTest',
            EntryType::Read,
            TestedRead::class,
        );
        $findings = new EntryTestFindings(
            [LoaderEntries::entryOf(UntestedRead::class), LoaderEntries::entryOf(TestedRead::class)],
            [$misplacedTest],
        );

        $this->assertSame([
            'The read Tests\\Fixtures\\EntryPointTests\\UntestedRead has no test: write one with #[TestsRead] at '
                .'tests/Reads/UntestedReadTest.php.',
        ], $findings->untestedReads());
        $this->assertSame([
            'tests/Feature/TestedReadTest.php tests the read Tests\\Fixtures\\EntryPointTests\\TestedRead: move '
                .'it to tests/Reads.',
        ], $findings->misplaced());
    }
}
