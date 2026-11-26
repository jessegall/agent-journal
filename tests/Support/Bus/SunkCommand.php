<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Contracts\Bus\Command;
use App\Support\Reflector;

/**
 * A command the test sink took in place of its handler: the command as it reached the end, the middleware it passed,
 * who sent it and under which request key.
 */
final readonly class SunkCommand
{
    /**
     * @param  Command<mixed>  $command
     * @param  list<class-string>  $trail
     */
    public function __construct(
        public Command $command,
        public array $trail,
        public string|null $actor,
        public string|null $requestKey,
    ) {}

    /**
     * @return class-string<Command<mixed>>
     */
    public function name(): string
    {
        return $this->command::class;
    }

    /**
     * Whether the command is of the class and each named public property holds the given value: the same scalar or
     * array, or a value object with equal fields.
     *
     * @param  array<string, mixed>  $arguments
     */
    public function matches(string $command, array $arguments): bool
    {
        if ($command !== $this->command::class) {
            return false;
        }

        foreach ($arguments as $property => $value) {
            if (! Reflector::of($this->command)->hasProperty($property)
                || ! self::isSameValue($this->command->{$property}, $value)) {
                return false;
            }
        }

        return true;
    }

    /**
     * The sent values of the named properties, written out for a failure message.
     *
     * @param  list<string>  $properties
     */
    public function describe(array $properties): string
    {
        $sent = [];

        foreach ($properties as $property) {
            $sent[$property] = Reflector::of($this->command)->hasProperty($property)
                ? $this->command->{$property}
                : '(no such property)';
        }

        return print_r($sent, true);
    }

    /**
     * A scalar or array is the same only when identical; a value object is the same when its fields are equal.
     */
    private static function isSameValue(mixed $sent, mixed $expected): bool
    {
        return is_object($expected) ? $sent == $expected : $sent === $expected;
    }
}
