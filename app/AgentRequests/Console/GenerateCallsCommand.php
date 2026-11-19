<?php

declare(strict_types=1);

namespace App\AgentRequests\Console;

use App\AgentRequests\Support\CallGroups;
use Illuminate\Console\Command;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * Writes the call group of every Calls folder of Core and the domains, and the JournalClient root over Core's groups;
 * with --check it changes nothing and fails on the first group that differs from what it would write.
 */
final class GenerateCallsCommand extends Command
{
    protected $signature = 'journal:calls {--check : Fail on the first group that differs instead of writing}';

    protected $description = 'Generate the typed groups of signed calls and the JournalClient';

    public function handle(ProcessFactory $processes): int
    {
        $files = self::files();

        foreach ($files as $path => $source) {
            if (! $this->option('check')) {
                file_put_contents($path, $source);

                continue;
            }

            if (! is_file($path) || $this->formatted($source, $processes) !== file_get_contents($path)) {
                $this->error('The generated file '.$this->relative($path).' differs: run php artisan journal:calls.');

                return self::FAILURE;
            }
        }

        if (! $this->option('check')) {
            $processes->newPendingProcess()->path(base_path())->run(['vendor/bin/pint', ...array_keys($files)]);
            $this->line(count($files).' generated files written.');
        }

        return self::SUCCESS;
    }

    /**
     * @return array<string, string> each generated file's source, by its path
     */
    private static function files(): array
    {
        $files = [];
        $coreGroups = [];

        foreach (glob(app_path('*/Calls'), GLOB_ONLYDIR) ?: [] as $folder) {
            $area = basename(dirname($folder));
            $namespace = "App\\{$area}\\Calls";
            $source = CallGroups::group($folder, $namespace, $area);

            if ($source !== null) {
                $files["{$folder}/".CallGroups::groupName($area).'.php'] = $source;
                /**
                 * @var class-string $group
                 */
                $group = $namespace.'\\'.CallGroups::groupName($area);
                $coreGroups[$area] = $group;
            }
        }

        foreach (glob(base_path('domain/*/src/Calls'), GLOB_ONLYDIR) ?: [] as $folder) {
            $domain = basename(dirname($folder, 2));
            $source = CallGroups::group($folder, "Domain\\{$domain}\\Calls", $domain);

            if ($source !== null) {
                $files["{$folder}/".CallGroups::groupName($domain).'.php'] = $source;
            }
        }

        $files[app_path('AgentRequests/Client/JournalClient.php')] = CallGroups::client($coreGroups);

        return $files;
    }

    /**
     * The source as Pint writes it, so a check compares what the generator would leave on disk.
     */
    private function formatted(string $source, ProcessFactory $processes): string
    {
        $scratch = tempnam(sys_get_temp_dir(), 'calls').'.php';
        file_put_contents($scratch, $source);
        $processes->newPendingProcess()->path(base_path())->run(['vendor/bin/pint', $scratch]);
        $formatted = (string) file_get_contents($scratch);
        unlink($scratch);

        return $formatted;
    }

    private function relative(string $path): string
    {
        return substr($path, strlen(base_path()) + 1);
    }
}
