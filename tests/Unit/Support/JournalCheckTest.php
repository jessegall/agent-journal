<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * journal-check worktree-clean passes only a worktree with nothing uncommitted and nothing hidden, run on temporary
 * repositories exactly as the host runs it: no argument, the workspace from its protected variable.
 */
#[TimeLimit(seconds: 10, reason: 'Each case builds a temporary git repository and runs git several times.')]
final class JournalCheckTest extends TestCase
{
    private string $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = $this->newRepository();
    }

    protected function tearDown(): void
    {
        (new Process(['rm', '-rf', $this->repository]))->run();

        parent::tearDown();
    }

    public function test_a_clean_committed_tree_passes(): void
    {
        [$code, $output] = $this->check();

        $this->assertSame([0, "The worktree is clean.\n"], [$code, $output]);
    }

    /**
     * @return iterable<string, array{0: callable(self): void, 1: string}>
     */
    public static function dirtyTrees(): iterable
    {
        yield 'an edited tracked file' => [fn (self $test) => $test->write('notes.md', 'changed'), 'Changed and not committed: notes.md'];
        yield 'an untracked file' => [fn (self $test) => $test->write('new.md', 'new'), 'Untracked: new.md'];
        yield 'a staged change' => [function (self $test): void {
            $test->write('notes.md', 'staged');
            $test->git('add', 'notes.md');
        }, 'Staged but not committed: notes.md'];
        yield 'a skip-worktree file' => [fn (self $test) => $test->git('update-index', '--skip-worktree', 'notes.md'), 'Marked skip-worktree or assume-unchanged: notes.md'];
        yield 'a detached head' => [fn (self $test) => $test->git('checkout', '--detach'), 'HEAD is detached'];
        yield 'a dirty submodule' => [function (self $test): void {
            $inner = $test->newRepository();
            $test->git('-c', 'protocol.file.allow=always', 'submodule', 'add', $inner, 'inner');
            $test->git('commit', '-m', 'Add the submodule.');
            file_put_contents("{$test->repository}/inner/notes.md", 'dirty');
        }, 'Changed and not committed: inner'];
    }

    /**
     * @param  callable(self): void  $dirty
     */
    #[DataProvider('dirtyTrees')]
    public function test_a_dirty_tree_fails_with_a_summary(callable $dirty, string $summary): void
    {
        $dirty($this);

        [$code, $output] = $this->check();

        $this->assertSame(1, $code);
        $this->assertStringContainsString($summary, $output);
    }

    public function test_an_argument_is_refused_so_the_workspace_never_comes_from_the_caller(): void
    {
        $process = new Process([PHP_BINARY, $this->executable(), 'worktree-clean', '/somewhere/else'], null, ['JOURNAL_CHECK_WORKSPACE' => $this->repository]);
        $process->run();

        $this->assertSame(2, $process->getExitCode());
    }

    public function write(string $path, string $text): void
    {
        file_put_contents("{$this->repository}/{$path}", $text);
    }

    public function git(string ...$arguments): void
    {
        $this->gitIn($this->repository, ...$arguments);
    }

    public function newRepository(): string
    {
        $repository = sys_get_temp_dir().'/journal-check-'.bin2hex(random_bytes(6));
        mkdir($repository);
        $this->gitIn($repository, 'init', '-q', '-b', 'main');
        file_put_contents("{$repository}/notes.md", 'first');
        $this->gitIn($repository, 'add', 'notes.md');
        $this->gitIn($repository, 'commit', '-q', '-m', 'First.');

        return $repository;
    }

    private function gitIn(string $repository, string ...$arguments): void
    {
        $process = new Process(['git', '-C', $repository, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', ...$arguments]);
        $process->mustRun();
    }

    /**
     * @return array{0: int|null, 1: string}
     */
    private function check(): array
    {
        $process = new Process([PHP_BINARY, $this->executable(), 'worktree-clean'], null, ['JOURNAL_CHECK_WORKSPACE' => $this->repository]);
        $process->run();

        return [$process->getExitCode(), $process->getOutput()];
    }

    private function executable(): string
    {
        return dirname(__DIR__, 3).'/tools/journal-check/journal-check';
    }
}
