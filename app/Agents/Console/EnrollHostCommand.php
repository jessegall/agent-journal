<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Actors\Support\ActorStore;
use App\Agents\Commands\EnrollHost;
use App\Agents\Support\EnrolledHost;
use App\Bus\Contracts\CommandBus;
use Illuminate\Console\Command;
use App\Agents\Exceptions\HostEnrollmentInvalid;

/**
 * Enrolls this machine's agent host, run by whoever operates the machine; the secret is printed once.
 */
final class EnrollHostCommand extends Command
{
    protected $signature = 'agents:host-enroll {name : The installation name of the host} {--root=* : A folder the host may launch agents in}';

    protected $description = 'Enroll a host that runs agent programs and print its secret once';

    public function handle(CommandBus $commands, ActorStore $actors): int
    {
        $enrolled = $actors->actAsSystem(fn (): EnrolledHost => $commands->run(new EnrollHost($this->installationName(), $this->launchRoots())));

        $this->line("Host {$enrolled->hostId} is enrolled. Its secret, shown only now:");
        $this->line($enrolled->secret);

        return self::SUCCESS;
    }

    /**
     * The name argument, which the signature makes a required single value.
     */
    private function installationName(): string
    {
        $name = $this->argument('name');

        return is_string($name) ? $name : throw HostEnrollmentInvalid::withoutName();
    }

    /**
     * @return list<string>
     */
    private function launchRoots(): array
    {
        return array_values(array_filter((array) $this->option('root'), is_string(...)));
    }
}
