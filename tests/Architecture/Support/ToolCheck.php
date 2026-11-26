<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Symfony\Component\Process\Process;

/**
 * A tools/refactoring check an architecture test runs, kept with what it printed under the state of the files it can
 * read, so a run over an unchanged tree reads the kept answer and never parses the project again. Any changed, added
 * or removed file under the read folders runs the check afresh once.
 */
final readonly class ToolCheck
{
    /**
     * The folders a check may read, its own code among them.
     */
    private const array READ_FOLDERS = ['app', 'domain', 'tools', 'tests', 'database', 'config', 'routes', 'docs/naming'];

    /**
     * How many seconds after its last change a file's stamp is trusted, past the one-second precision of a
     * modification time.
     */
    private const int RACY_SECONDS = 2;

    private function __construct(private string $output, private string $errorOutput, private int $exitCode) {}

    /**
     * The check's answer: the kept one when no read file changed since it was kept, else a fresh run of the command.
     *
     * @param  array<array-key, string>  $command
     */
    public static function run(array $command): self
    {
        $argv = array_values($command);
        $root = dirname(__DIR__, 3);
        $keptFile = "{$root}/storage/framework/testing/tool-checks/".sha1(implode("\0", $argv)).'.json';
        $treeKey = self::treeKey($root);
        $kept = is_file($keptFile) ? json_decode((string) file_get_contents($keptFile), true) : null;

        if (is_array($kept) && ($kept['tree'] ?? null) === $treeKey) {
            return new self($kept['output'], $kept['errorOutput'], $kept['exitCode']);
        }

        $process = new Process($argv, $root, timeout: 300);
        $process->run();
        $check = new self($process->getOutput(), $process->getErrorOutput(), (int) $process->getExitCode());
        $check->keep($keptFile, $treeKey);

        return $check;
    }

    public function output(): string
    {
        return $this->output;
    }

    public function errorOutput(): string
    {
        return $this->errorOutput;
    }

    public function exitCode(): int
    {
        return $this->exitCode;
    }

    public function isSuccessful(): bool
    {
        return $this->exitCode === 0;
    }

    /**
     * The stamp of every file a check may read, taken once per process: its path, size and modified time, and its
     * content's hash while that time is too recent to trust.
     */
    private static function treeKey(string $root): string
    {
        static $keys = [];

        clearstatcache();

        return $keys[$root] ??= sha1(implode("\n", self::stampsUnder($root)));
    }

    /**
     * @return list<string>
     */
    private static function stampsUnder(string $root): array
    {
        $stamps = [];
        $trusted = time() - self::RACY_SECONDS;

        foreach (self::READ_FOLDERS as $folder) {
            if (! is_dir("{$root}/{$folder}")) {
                continue;
            }

            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(
                "{$root}/{$folder}",
                FilesystemIterator::SKIP_DOTS,
            ));

            foreach ($files as $file) {
                if (! $file instanceof SplFileInfo || str_contains($file->getPathname(), '/node_modules/')) {
                    continue;
                }

                $modified = $file->getMTime();
                $content = $modified < $trusted ? '' : (string) sha1_file($file->getPathname());
                $stamps[] = "{$file->getPathname()}:{$file->getSize()}:{$modified}:{$content}";
            }
        }

        sort($stamps);

        return $stamps;
    }

    private function keep(string $keptFile, string $treeKey): void
    {
        if (! is_dir(dirname($keptFile))) {
            @mkdir(dirname($keptFile), 0777, true);
        }

        $temporary = $keptFile.'.'.getmypid();
        file_put_contents($temporary, json_encode([
            'tree' => $treeKey,
            'output' => $this->output,
            'errorOutput' => $this->errorOutput,
            'exitCode' => $this->exitCode,
        ]));
        rename($temporary, $keptFile);
    }
}
