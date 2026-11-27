<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Support\PintFormatter;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Hosts\Data\HostProtocolData;
use App\Hosts\HostProtocolSources;
use App\Values\FilePath;
use Illuminate\Console\Command;

/**
 * Writes the Go and PHP code of host protocol 1 from protocol/host.json; with --check it changes nothing and fails on
 * the first generated file that differs from what it would write. --into writes and checks under a folder of the
 * temporary place instead of the project, so a test can change a generated file without touching the project's.
 */
final class GenerateHostProtocolCommand extends Command
{
    protected $signature = 'journal:host-protocol
        {--check : Fail on the first file that differs instead of writing}
        {--into= : A folder of the temporary place to write and check in, instead of the project}';

    protected $description = 'Generate the Go and PHP code of the host protocol from protocol/host.json';

    public function handle(PintFormatter $pint, Files $files): int
    {
        $protocolFile = FilePath::in(Place::Project, HostProtocolSources::PROTOCOL_FILE);
        $sources = new HostProtocolSources(HostProtocolData::from($files->readJson($protocolFile)))->sources();
        $targets = [];

        foreach (array_keys($sources) as $relative) {
            $targets[$relative] = $this->target($relative);
        }

        if (! $this->option('check')) {
            foreach ($sources as $relative => $source) {
                $files->write($targets[$relative], $source);
            }

            $phpTargets = array_filter(
                $targets,
                fn (string $relative) => str_ends_with($relative, '.php'),
                ARRAY_FILTER_USE_KEY,
            );

            $pint->formatInPlace(array_values(array_map(
                fn (FilePath $target) => $files->realPath($target),
                $phpTargets,
            )));

            $this->line(count($sources).' generated files written.');

            return self::SUCCESS;
        }

        foreach ($sources as $relative => $source) {
            $expected = str_ends_with($relative, '.php') ? $pint->formatted($source) : $source;

            if (! $files->exists($targets[$relative]) || $expected !== $files->read($targets[$relative])) {
                $this->error("The generated file {$relative} differs: run php artisan journal:host-protocol.");

                return self::FAILURE;
            }
        }

        return self::SUCCESS;
    }

    private function target(string $relative): FilePath
    {
        $into = $this->option('into');

        if (! is_string($into)) {
            return FilePath::in(Place::Project, $relative);
        }

        return FilePath::in(Place::Temporary, "{$into}/{$relative}");
    }
}
