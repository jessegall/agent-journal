<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\ProcessApi;
use App\Attributes\Rules\OutsideThePlaces;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Files\Enums\PlaceExemption;
use App\Processes\Enums\OutputStream;
use App\Values\CommandReport;
use Illuminate\Console\Command;

/**
 * Writes the stored raw bytes of one part's stream to a file, with a label beside it saying it is diagnostic output.
 */
#[JournalRoute(JournalRouteType::Write, [CommandClass::Write])]
final class ProcessExportCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'process:export {run : The run id} {--part=0 : The syntax node of the part} {--stream=stdout} {--to= : The file to write}';

    protected $description = 'Write a part\'s stored output to a file';

    #[OutsideThePlaces(PlaceExemption::UserNamedFile)]
    public function handle(ProcessApi $processes): int
    {
        $run = (string) $this->argument('run');
        $file = (string) $this->option('to');

        return $this->runReport(function () use ($processes, $run, $file): CommandReport {
            $stream = OutputStream::from((string) $this->option('stream'));
            $output = $processes->readOutputBytes($run, (int) $this->option('part'), $stream);
            file_put_contents($file, $output->decoded());
            $part = (int) $this->option('part');
            $label = "Diagnostic output of run {$run}, part {$part}, {$stream->value}; never a result.\n";
            file_put_contents($file.'.label', $label);

            return CommandReport::ending(self::SUCCESS)->line("Wrote {$file}.");
        });
    }
}
