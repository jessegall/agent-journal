<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\AssignmentWriteScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An assignment's holder and record and a claim authorization's fields are written only by their models and their
 * writers in Assignments and Desks, and no state reaches Assignments (doc 74). Allocation, delegation and run claims
 * call those writers, so they stay allowed.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class AssignmentWriteBoundaryTest extends TestCase
{
    /**
     * The folders whose files may write the fields: the models and the writers.
     */
    private const array WRITERS = ['app/Assignments/', 'app/Desks/Support/'];

    private const string FIXTURES = 'tests/Fixtures/Assignments/WriteBoundary';

    public function test_only_the_assignment_models_and_writers_write_holders_and_claims(): void
    {
        $this->assertSame([], $this->writesIn(['app', 'domain']));
    }

    public function test_a_listener_writing_a_holder_and_a_state_reaching_a_writer_are_named(): void
    {
        $this->assertSame([
            self::FIXTURES.'/AssignsFromAState.php:15 state names App\\Assignments\\Contracts\\AssignmentWriter',
            self::FIXTURES.'/MovesTheHolder.php:17 writes holder_id',
        ], $this->writesIn([self::FIXTURES]));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function writesIn(array $folders): array
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new AssignmentWriteScan(), array_map(base_path(...), $folders)) as $path => $writes) {
            $file = substr($path, strlen(base_path()) + 1);

            if (str_contains($file, '/tests/')) {
                continue;
            }

            if (array_any(self::WRITERS, fn (string $writer) => str_starts_with($file, $writer))) {
                continue;
            }

            foreach ($writes as $write) {
                [$line, $what] = explode(' ', $write, 2);
                $found[] = "{$file}:{$line} {$what}";
            }
        }

        sort($found);

        return $found;
    }
}
