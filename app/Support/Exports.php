<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Events\Event;
use App\Exceptions\MalformedExports;
use Throwable;

/**
 * What an owner makes public, in six lists: events, contracts, values, commands, exceptions and support. It is built
 * through ExportBuilder, whose build() checks each name once; nothing constructs it unchecked.
 */
final readonly class Exports
{
    /**
     * @param  list<class-string<Event>>  $events
     * @param  list<class-string>  $contracts
     * @param  list<class-string>  $valueClasses
     * @param  list<class-string>  $commands
     * @param  list<class-string<Throwable>>  $exceptions
     * @param  list<class-string>  $support
     */
    private function __construct(
        public array $events,
        public array $contracts,
        public array $valueClasses,
        public array $commands,
        public array $exceptions,
        public array $support,
        public string|null $openNamespace = null,
    ) {}

    /**
     * Every class of the namespace, such as core's: whatever it holds may be used outside it.
     */
    public static function everythingIn(string $namespace): self
    {
        return new self([], [], [], [], [], [], $namespace);
    }

    public static function make(): ExportBuilder
    {
        return ExportBuilder::make();
    }

    /**
     * The declaration a builder holds, after every name is checked: none empty and no name listed twice.
     *
     * @throws MalformedExports
     */
    public static function of(ExportBuilder $builder): self
    {
        $lists = [
            'events' => $builder->events,
            'contracts' => $builder->contracts,
            'values' => $builder->valueClasses,
            'commands' => $builder->commands,
            'exceptions' => $builder->exceptions,
            'support' => $builder->support,
        ];

        $seenIn = [];

        foreach ($lists as $exportGroup => $names) {
            foreach ($names as $position => $name) {
                $key = self::normalized($name);

                if ($key === '') {
                    throw MalformedExports::emptyName($exportGroup, $position);
                }

                if (isset($seenIn[$key])) {
                    throw MalformedExports::listedTwice($name, $seenIn[$key], $exportGroup);
                }

                $seenIn[$key] = $exportGroup;
            }
        }

        return new self(
            $builder->events,
            $builder->contracts,
            $builder->valueClasses,
            $builder->commands,
            $builder->exceptions,
            $builder->support,
        );
    }

    /**
     * Every exported name in the order events, contracts, values, commands, exceptions, support.
     *
     * @return list<class-string>
     */
    public function all(): array
    {
        return [
            ...$this->events,
            ...$this->contracts,
            ...$this->valueClasses,
            ...$this->commands,
            ...$this->exceptions,
            ...$this->support,
        ];
    }

    public function has(string $name): bool
    {
        return $this->opens($name) || self::listHolds($this->all(), $name);
    }

    public function hasEvent(string $name): bool
    {
        return $this->opens($name) || self::listHolds($this->events, $name);
    }

    public function hasCommand(string $name): bool
    {
        return $this->opens($name) || self::listHolds($this->commands, $name);
    }

    /**
     * Whether the name sits in the namespace these exports open whole.
     */
    private function opens(string $name): bool
    {
        if ($this->openNamespace === null) {
            return false;
        }

        return str_starts_with(self::normalized($name), self::normalized($this->openNamespace).'\\');
    }

    /**
     * @param  list<class-string>  $names
     */
    private static function listHolds(array $names, string $name): bool
    {
        $wanted = self::normalized($name);

        return array_any($names, fn (string $listed) => self::normalized($listed) === $wanted);
    }

    /**
     * A class name as PHP compares it: without a leading backslash and without case.
     */
    private static function normalized(string $name): string
    {
        return strtolower(ltrim($name, '\\'));
    }
}
