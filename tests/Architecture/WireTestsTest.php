<?php

declare(strict_types=1);

namespace Tests\Architecture;

use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A test of what crosses the wire lives in tests/Wire, the suite composer test leaves out, and says so with
 * #[OverTheWire]; every test there says so too. No test file still calls a mock by its old name.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every test file.')]
final class WireTestsTest extends TestCase
{
    private const string HOW_TO_PLACE = 'Move a test over the wire into tests/Wire and mark every test there #[OverTheWire]:';

    private const string HOW_TO_NAME = 'Call a mock a mock, never by its old name:';

    /**
     * The old name in each form it took; the recorded device code of the Codex recordings is recorded data.
     */
    private const string OLD_NAME = '/(?<![A-Za-z])(stand-in|Stand-in|StandIn|standin|standIn)(?![a-z])|[a-z]StandIn/';

    public function test_every_test_over_the_wire_lives_in_tests_wire_and_every_test_there_says_so(): void
    {
        $misplaced = [];

        foreach (self::filesUnderTests() as $path) {
            if ($path === __FILE__) {
                continue;
            }

            $isMarked = str_contains((string) file_get_contents($path), '#[OverTheWire]');
            $isInWire = str_starts_with($path, base_path('tests/Wire/'));
            $relative = substr($path, strlen(base_path()) + 1);

            if ($isMarked && ! $isInWire) {
                $misplaced[] = "{$relative} is marked outside tests/Wire";
            }

            if ($isInWire && str_ends_with($path, 'Test.php') && ! $isMarked) {
                $misplaced[] = "{$relative} is in tests/Wire without the mark";
            }
        }

        $this->assertSame([], $misplaced, self::HOW_TO_PLACE);
    }

    public function test_no_test_file_calls_a_mock_by_its_old_name(): void
    {
        $named = [];

        foreach (self::filesUnderTests() as $path) {
            if ($path === __FILE__) {
                continue;
            }

            if (preg_match(self::OLD_NAME, (string) file_get_contents($path)) === 1) {
                $named[] = substr($path, strlen(base_path()) + 1);
            }
        }

        $this->assertSame([], $named, self::HOW_TO_NAME);
    }

    /**
     * Every file under tests but the fixtures, which hold samples a check is proven on.
     *
     * @return list<string>
     */
    private static function filesUnderTests(): array
    {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(base_path('tests'), FilesystemIterator::SKIP_DOTS),
        );
        $paths = [];

        foreach ($files as $file) {
            /** @var SplFileInfo $file */
            $path = $file->getPathname();

            if ($file->isFile() && ! str_starts_with($path, base_path('tests/Fixtures/'))) {
                $paths[] = $path;
            }
        }

        sort($paths);

        return $paths;
    }
}
