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
 * the first generated file that differs from what it would write.
 */
final class GenerateHostProtocolCommand extends Command
{
    protected $signature = 'journal:host-protocol {--check : Fail on the first file that differs instead of writing}';

    protected $description = 'Generate the Go and PHP code of the host protocol from protocol/host.json';

    public function handle(PintFormatter $pint, Files $files): int
    {
        $protocol = HostProtocolData::from($files->readJson(FilePath::in(Place::Project, HostProtocolSources::PROTOCOL_FILE)));
        $sources = new HostProtocolSources($protocol)->sources();
        $phpFiles = array_values(array_filter(array_keys($sources), fn (string $path) => str_ends_with($path, '.php')));

        if (! $this->option('check')) {
            foreach ($sources as $relative => $source) {
                $files->write(FilePath::in(Place::Project, $relative), $source);
            }

            $pint->formatInPlace($phpFiles);
            $this->line(count($sources).' generated files written.');

            return self::SUCCESS;
        }

        foreach ($sources as $relative => $source) {
            $file = FilePath::in(Place::Project, $relative);
            $expected = in_array($relative, $phpFiles, true) ? $pint->formatted($source) : $source;

            if (! $files->exists($file) || $expected !== $files->read($file)) {
                $this->error("The generated file {$relative} differs: run php artisan journal:host-protocol.");

                return self::FAILURE;
            }
        }

        return self::SUCCESS;
    }
}
