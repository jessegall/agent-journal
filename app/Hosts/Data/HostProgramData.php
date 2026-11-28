<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A program the journal ships into a session, with the arguments it takes after its own name, in order.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostProgramData extends Data
{
    /**
     * @param  list<string>  $arguments  what a program of the host takes after its own name, in order
     * @param  array<string, string>  $words  a driver's words, each with the values it takes: none, one or list
     * @param  array<string, string>  $options  a driver's options, each with the values it takes: none, one, or list
     *                                          for all up to the next option
     * @param  array<string, list<string>>  $commands  the host program's commands, each with the flags it takes
     */
    public function __construct(
        public readonly string $description,
        public readonly array $arguments = [],
        public readonly string|null $executable = null,
        public readonly array $words = [],
        public readonly array $options = [],
        public readonly bool $takesPrompt = false,
        public readonly array $commands = [],
        public readonly bool $printsOnProgramStreams = true,
    ) {}
}
