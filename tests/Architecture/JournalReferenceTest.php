<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\JournalReferences;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A comment says its reason in plain words: it never points at this project's own rules, tasks, documents, plans or
 * messages by number, which someone else opening the code does not have.
 */
#[TimeLimit(seconds: 20, reason: 'It reads every source file of the project.')]
final class JournalReferenceTest extends TestCase
{
    private const array FOLDERS = ['app', 'domain', 'tests', 'tools', 'scripts', '.docker', 'resources'];

    private const array SOURCE_ENDINGS = ['.php', '.go', '.sh', '.ts', '.vue', '.js', '.py', '.css', 'Dockerfile', '.conf'];

    public function test_no_comment_points_at_a_journal_record(): void
    {
        $found = [];

        foreach ($this->sourceFiles() as $path) {
            array_push($found, ...JournalReferences::in($path, (string) file_get_contents(base_path($path))));
        }

        $this->assertSame([], $found);
    }

    public function test_a_comment_naming_a_rule_is_pointed_out_and_an_example_record_is_not(): void
    {
        $path = 'tests/Fixtures/JournalReferences/ReferringComment.php';

        $this->assertSame([$path.':8'], JournalReferences::in($path, (string) file_get_contents(base_path($path))));
    }

    /**
     * @return list<string>
     */
    private function sourceFiles(): array
    {
        $listed = (string) shell_exec('git -C '.escapeshellarg(base_path()).' ls-files '.implode(' ', self::FOLDERS));

        return array_values(array_filter(
            explode("\n", $listed),
            fn (string $path) => $path !== ''
                && ! str_starts_with($path, 'tests/Fixtures/JournalReferences/')
                && ! str_starts_with($path, 'tests/Architecture/Legacy/')
                && ! str_contains($path, '/testdata/')
                && array_any(self::SOURCE_ENDINGS, fn (string $ending) => str_ends_with($path, $ending)),
        ));
    }
}
