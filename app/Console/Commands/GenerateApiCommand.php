<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Support\ApiGroups;
use App\Values\FilePath;
use Illuminate\Console\Command;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * Writes the API group of every Api folder of Core and the domains, and the JournalClient root over Core's groups;
 * with --check it changes nothing and fails on the first group that differs from what it would write.
 */
final class GenerateApiCommand extends Command
{
    protected $signature = 'journal:api {--check : Fail on the first group that differs instead of writing}';

    protected $description = 'Generate the typed groups of the journal API and the JournalClient';

    public function handle(ProcessFactory $processes, Files $files): int
    {
        $generated = self::generated($files);

        foreach ($generated as $relative => $source) {
            $file = FilePath::in(Place::Project, $relative);

            if (! $this->option('check')) {
                $files->write($file, $source);

                continue;
            }

            if (! $files->exists($file) || $this->formatted($source, $processes, $files) !== $files->read($file)) {
                $this->error("The generated file {$relative} differs: run php artisan journal:api.");

                return self::FAILURE;
            }
        }

        if (! $this->option('check')) {
            $processes->newPendingProcess()->path(base_path())->run(['vendor/bin/pint', ...array_keys($generated)]);

            $this->line(count($generated).' generated files written.');
        }

        return self::SUCCESS;
    }

    /**
     * @return array<string, string> each generated file's source, by its path from the project root
     */
    private static function generated(Files $files): array
    {
        $generated = [];
        $coreGroups = [];

        foreach (self::apiFolders($files, 'app/Api/*') as $folder) {
            $area = basename($folder->relative);
            $namespace = "App\\Api\\{$area}";
            $source = ApiGroups::group($files->realPath($folder), $namespace, $area);

            if ($source !== null) {
                $groupName = ApiGroups::groupName($area);
                $generated["{$folder->relative}/{$groupName}.php"] = $source;
                /**
                 * @var class-string $group
                 */
                $group = $namespace.'\\'.$groupName;
                $coreGroups[$area] = $group;
            }
        }

        foreach (self::apiFolders($files, 'domain/*/src/Api') as $folder) {
            $domain = basename(dirname($folder->relative, 2));
            $source = ApiGroups::group($files->realPath($folder), "Domain\\{$domain}\\Api", $domain);

            if ($source !== null) {
                $generated["{$folder->relative}/".ApiGroups::groupName($domain).'.php'] = $source;
            }
        }

        $generated['app/Support/JournalClient.php'] = ApiGroups::client($coreGroups);

        return $generated;
    }

    /**
     * The Api folders a pattern names in the project.
     *
     * @return list<FilePath>
     */
    private static function apiFolders(Files $files, string $pattern): array
    {
        $folders = [];

        foreach ($files->matching(FilePath::in(Place::Project, $pattern)) as $entry) {
            if ($entry->isFolder()) {
                $folders[] = $entry->path;
            }
        }

        return $folders;
    }

    /**
     * The source as Pint writes it, so a check compares what the generator would leave on disk.
     */
    private function formatted(string $source, ProcessFactory $processes, Files $files): string
    {
        return $files->scratch(function (FilePath $scratch) use ($source, $processes, $files) {
            $files->write($scratch, $source);

            $processes->newPendingProcess()->path(base_path())->run(['vendor/bin/pint', $files->realPath($scratch)]);

            return $files->read($scratch);
        }, '.php');
    }
}
