<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Writes the stored raw bytes of one part's stream to a file, with a label beside it saying it is diagnostic output.
 */
#[JournalRoute(JournalRouteType::Write, [CommandClass::Write])]
final class ProcessExportCommand extends Command
{
    protected $signature = 'process:export {run : The run id} {--part=0 : The syntax node of the part} {--stream=stdout} {--to= : The file to write}';

    protected $description = 'Write a part\'s stored output to a file';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $journal->send("/agent/processes/runs/{$this->argument('run')}/output", ['mode' => 'raw', 'part' => (int) $this->option('part'), 'stream' => (string) $this->option('stream')]);
        $file = (string) $this->option('to');
        file_put_contents($file, (string) base64_decode((string) $reply->body['bytes'], true));
        file_put_contents($file.'.label', "Diagnostic output of run {$this->argument('run')}, part {$this->option('part')}, {$this->option('stream')}; never a result.\n");
        $this->line("Wrote {$file}.");

        return self::SUCCESS;
    }
}
