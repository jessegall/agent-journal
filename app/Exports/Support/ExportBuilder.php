<?php

declare(strict_types=1);

namespace App\Exports\Support;

use App\Contracts\Event;
use App\Exports\Exceptions\MalformedExports;
use Throwable;

/**
 * Builds an owner's Exports one list at a time. Each call returns a new builder, so a builder shared by two callers
 * gives two independent declarations.
 */
final readonly class ExportBuilder
{
    /**
     * @param  list<class-string<Event>>  $events
     * @param  list<class-string>  $contracts
     * @param  list<class-string>  $values
     * @param  list<class-string>  $commands
     * @param  list<class-string<Throwable>>  $exceptions
     * @param  list<class-string>  $support
     */
    private function __construct(
        public array $events = [],
        public array $contracts = [],
        public array $values = [],
        public array $commands = [],
        public array $exceptions = [],
        public array $support = [],
    ) {}

    public static function make(): self
    {
        return new self();
    }

    /**
     * @param  class-string<Event>  ...$events
     */
    public function events(string ...$events): self
    {
        return clone ($this, ['events' => [...$this->events, ...self::plainList('events', $events)]]);
    }

    /**
     * @param  class-string  ...$contracts
     */
    public function contracts(string ...$contracts): self
    {
        return clone ($this, ['contracts' => [...$this->contracts, ...self::plainList('contracts', $contracts)]]);
    }

    /**
     * @param  class-string  ...$values
     */
    public function values(string ...$values): self
    {
        return clone ($this, ['values' => [...$this->values, ...self::plainList('values', $values)]]);
    }

    /**
     * @param  class-string  ...$commands
     */
    public function commands(string ...$commands): self
    {
        return clone ($this, ['commands' => [...$this->commands, ...self::plainList('commands', $commands)]]);
    }

    /**
     * @param  class-string<Throwable>  ...$exceptions
     */
    public function exceptions(string ...$exceptions): self
    {
        return clone ($this, ['exceptions' => [...$this->exceptions, ...self::plainList('exceptions', $exceptions)]]);
    }

    /**
     * @param  class-string  ...$support
     */
    public function support(string ...$support): self
    {
        return clone ($this, ['support' => [...$this->support, ...self::plainList('support', $support)]]);
    }

    /**
     * @throws MalformedExports
     */
    public function build(): Exports
    {
        return Exports::of($this);
    }

    /**
     * Names passed by position; a name passed by key is refused, since a list has no keys.
     *
     * @template TName of string
     *
     * @param  array<int|string, TName>  $names
     * @return list<TName>
     *
     * @throws MalformedExports
     */
    private static function plainList(string $exportGroup, array $names): array
    {
        if (! array_is_list($names)) {
            throw MalformedExports::keyedList($exportGroup);
        }

        return $names;
    }
}
