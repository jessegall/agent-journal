<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Agents\Commands\EnrollHost;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use Illuminate\Console\Command;

/**
 * Enrolls this machine's agent host, run by whoever operates the machine; the secret is printed once.
 */
final class EnrollHostCommand extends Command
{
    protected $signature = 'agents:host-enroll {name : The installation name of the host} {--root=* : A folder the host may start agents in}';

    protected $description = 'Enroll a host that runs agent programs and print its secret once';

    public function handle(EntryDispatchers $dispatchers): int
    {
        $enroll = new EnrollHost($this->installationName(), $this->startRoots());
        $enrolled = $dispatchers->runAsJournal(CommandEntry::HostControl, 'host enrolment', $enroll);

        $this->line("Host {$enrolled->hostId} is enrolled. Its secret, shown only now:");
        $this->line($enrolled->secret);

        return self::SUCCESS;
    }

    /**
     * The name argument, which the signature makes a required single value.
     */
    private function installationName(): string
    {
        return $this->argument('name');
    }

    /**
     * @return list<string>
     */
    private function startRoots(): array
    {
        return array_values(array_filter((array) $this->option('root'), is_string(...)));
    }
}
