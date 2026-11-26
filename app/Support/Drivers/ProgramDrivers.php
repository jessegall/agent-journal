<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\Drivers\ProgramDriver;
use App\Enums\Hosts\HostProcessPurpose;
use App\Exceptions\ProgramDriverMissing;
use App\Models\Hosts\HostProcess;
use Illuminate\Contracts\Container\Container;

/**
 * The program driver of each process purpose, made for one process and the worker generation that drives it.
 */
final readonly class ProgramDrivers
{
    /**
     * @param  array<string, class-string<ProgramDriver>>  $drivers  by purpose
     */
    public function __construct(private Container $container, private array $drivers = []) {}

    /**
     * @param  class-string<ProgramDriver>  $driver
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
     * @throws ProgramDriverMissing
     */
    public function for(HostProcess $process, int $generation): ProgramDriver
    {
        $driver = $this->drivers[$process->purpose->value] ?? throw ProgramDriverMissing::forPurpose($process->purpose);

        return $this->container->make($driver, ['process' => $process, 'generation' => $generation]);
    }
}
