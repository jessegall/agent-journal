<?php

declare(strict_types=1);

namespace Tests\Unit\Tools;

use PHPUnit\Framework\TestCase;

/**
 * Batch admission, recovery and phase evidence: the manifest applier refuses an occupied destination, a
 * case-folded clash, a stale source and an unrecorded edit, previews without touching the tree, and resumes a batch
 * that stopped half way.
 */
final class ApplyManifestTest extends TestCase
{
    private string $tree;

    protected function setUp(): void
    {
        $this->tree = sys_get_temp_dir().'/apply-manifest-'.bin2hex(random_bytes(4));
        mkdir($this->tree.'/app/Area/Templates', 0777, true);
        file_put_contents($this->tree.'/app/Area/Templates/a.txt', "first\n");
        file_put_contents($this->tree.'/app/Area/Templates/b.txt', "second\n");
        file_put_contents($this->tree.'/notes.txt', "see app/Area/Templates/a.txt\n");
        $this->git('init -q');
        $this->git('add -A');
        $this->git('-c user.name=test -c user.email=test@example.test commit -q -m base');
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->tree).' '.escapeshellarg($this->tree.'.manifest.json').' '.escapeshellarg($this->tree.'.state.json'));
    }

    public function test_a_dry_run_passes_and_leaves_the_tree_alone(): void
    {
        [$exit] = $this->apply($this->manifest(), '--dry-run');

        $this->assertSame(0, $exit);
        $this->assertFileExists($this->tree.'/app/Area/Templates/a.txt');
        $this->assertFileDoesNotExist($this->tree.'/resources/a.txt');
    }

    public function test_an_occupied_destination_is_refused(): void
    {
        mkdir($this->tree.'/resources');
        file_put_contents($this->tree.'/resources/a.txt', "taken\n");

        [$exit, $errors] = $this->apply($this->manifest(), '--dry-run');

        $this->assertSame(1, $exit);
        $this->assertStringContainsString('resources/a.txt', $errors);
        $this->assertStringContainsString('occupied', $errors);
    }

    public function test_two_rows_that_meet_when_case_is_folded_are_refused(): void
    {
        $manifest = $this->manifest();
        $manifest[1]['final_path'] = 'resources/A.txt';

        [$exit, $errors] = $this->apply($manifest, '--dry-run');

        $this->assertSame(1, $exit);
        $this->assertStringContainsString('case-folded', $errors);
    }

    public function test_a_source_changed_since_the_manifest_is_stale(): void
    {
        $manifest = $this->manifest();
        file_put_contents($this->tree.'/app/Area/Templates/a.txt', "edited\n");

        [$exit, $errors] = $this->apply($manifest, '--dry-run');

        $this->assertSame(1, $exit);
        $this->assertStringContainsString('stale', $errors);
    }

    public function test_a_half_applied_batch_resumes_with_the_rest_and_an_unrecorded_edit_is_refused(): void
    {
        $manifest = $this->manifest();
        $staleSecond = $manifest;
        $staleSecond[1]['blob'] = 'not-the-blob';

        [$firstExit, $firstErrors] = $this->apply($staleSecond, '--rows=app/Area/Templates/a.txt');
        $this->assertSame(0, $firstExit, $firstErrors);
        $this->assertFileExists($this->tree.'/resources/a.txt');
        $this->assertStringContainsString('resources/a.txt', (string) file_get_contents($this->tree.'/notes.txt'));

        [$resumedExit, $resumedErrors] = $this->apply($manifest);
        $this->assertSame(0, $resumedExit, $resumedErrors);
        $this->assertFileExists($this->tree.'/resources/b.txt');

        file_put_contents($this->tree.'/notes.txt', "changed by hand\n");
        [$exit, $errors] = $this->apply($manifest, '--dry-run');

        $this->assertSame(1, $exit);
        $this->assertStringContainsString('notes.txt', $errors);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function manifest(): array
    {
        $row = fn (string $name) => [
            'revision' => 'base',
            'blob' => trim((string) shell_exec('cd '.escapeshellarg($this->tree).' && git hash-object app/Area/Templates/'.$name)),
            'old_path' => 'app/Area/Templates/'.$name,
            'old_class' => null,
            'final_path' => 'resources/'.$name,
            'final_class' => null,
            'status' => 'move',
            'kind' => 'blade or static asset',
            'literal_references' => $name === 'a.txt' ? ['notes.txt'] : [],
        ];

        return [$row('a.txt'), $row('b.txt')];
    }

    /**
     * @param  list<array<string, mixed>>  $manifest
     * @return array{int, string}
     */
    private function apply(array $manifest, string ...$options): array
    {
        $file = $this->tree.'.manifest.json';
        file_put_contents($file, json_encode($manifest, JSON_THROW_ON_ERROR));
        $command = [
            PHP_BINARY,
            dirname(__DIR__, 3).'/tools/refactoring/layout/apply-manifest.php',
            $file,
            '--root='.$this->tree,
            '--state='.$this->tree.'.state.json',
            ...$options,
        ];
        $process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
        stream_get_contents($pipes[1]);
        $errors = (string) stream_get_contents($pipes[2]);

        return [proc_close($process), $errors];
    }

    private function git(string $arguments): void
    {
        exec('cd '.escapeshellarg($this->tree).' && git '.$arguments);
    }
}
