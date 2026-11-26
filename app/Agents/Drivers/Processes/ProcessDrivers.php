<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Processes;

use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Exceptions\ProcessDriverMissing;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use Illuminate\Contracts\Container\Container;

/**
 * The process driver of each process purpose, made for one process and the worker generation that drives it.
 */
final readonly class ProcessDrivers
{
    /**
     * @param  array<string, class-string<ProcessDriver>>  $drivers  by purpose
     */
    public function __construct(private Container $container, private array $drivers = []) {}

    /**
     * @param  class-string<ProcessDriver>  $driver
     */
    public function with(HostProcessPurpose $purpose, string $driver): self
    {
        return new self($this->container, [...$this->drivers, $purpose->value => $driver]);
    }

    /**
     * @return list<HostProcessPurpose>
     */
    public function purposes(): array
    {
        return array_map(fn (string $purpose) => HostProcessPurpose::from($purpose), array_keys($this->drivers));
    }

    /**
     * @throws ProcessDriverMissing
     */
    public function for(HostProcess $process, int $generation): ProcessDriver
    {
        $driver = $this->drivers[$process->purpose->value] ?? throw ProcessDriverMissing::forPurpose($process->purpose);

        return $this->container->make($driver, ['process' => $process, 'generation' => $generation]);
    }
}
