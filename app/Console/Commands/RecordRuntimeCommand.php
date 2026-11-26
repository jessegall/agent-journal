<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Drivers\Commands\RecordRuntime\RecordRuntimeCommand as RecordRuntime;
use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * The owner starts or stops a redacted recording of an agent's runtime on its host.
 */
final class RecordRuntimeCommand extends Command
{
    protected $signature = 'agents:runtime-record {agent : The agent} {session : Its session} {--stop : Stop the recording instead of starting one}';

    protected $description = 'Start or stop a redacted recording of an agent runtime on its host';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $stop = (bool) $this->option('stop');

        try {
            $commands->run(new RecordRuntime(
                (string) $this->argument('agent'),
                (string) $this->argument('session'),
                (string) Str::ulid(),
                $stop,
            ));
        } finally {
            $owner->finish();
        }

        $this->line($stop ? 'The host stops the recording.' : 'The host starts a recording.');

        return self::SUCCESS;
    }
}
