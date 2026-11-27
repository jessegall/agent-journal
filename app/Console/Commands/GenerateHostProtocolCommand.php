<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Support\PintFormatter;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Hosts\HostProtocolCheck;
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

    public function handle(PintFormatter $pint, Files $files, HostProtocolCheck $check): int
    {
        $sources = $check->sources();
        $into = $this->option('into');
        $place = is_string($into) ? Place::Temporary : Place::Project;
        $folder = is_string($into) ? $into : '';

        if ($this->option('check')) {
            $drifted = $check->drifted($place, $folder);

            if ($drifted !== []) {
                $this->error("The generated file {$drifted[0]} differs: run php artisan journal:host-protocol.");

                return self::FAILURE;
            }

            return self::SUCCESS;
        }

        $targets = [];

        foreach ($sources as $relative => $source) {
            $targets[$relative] = FilePath::in($place, ltrim("{$folder}/{$relative}", '/'));
            $files->write($targets[$relative], $source);
        }

        $isPhp = fn (string $relative) => str_ends_with($relative, '.php');
        $phpTargets = array_filter($targets, $isPhp, ARRAY_FILTER_USE_KEY);
        $pint->formatInPlace(array_values(array_map(fn (FilePath $target) => $files->realPath($target), $phpTargets)));
        $this->line(count($sources).' generated files written.');

        return self::SUCCESS;
    }
}
