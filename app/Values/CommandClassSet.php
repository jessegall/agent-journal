<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandClass;

/**
 * A set of command classes, each held once and in the order of the enum; membership is exact, so edit never stands in
 * for write.
 */
final readonly class CommandClassSet
{
    /**
     * @param  list<CommandClass>  $classes
     */
    private function __construct(public array $classes) {}

    public static function of(CommandClass ...$classes): self
    {
        return new self(array_values(array_filter(
            CommandClass::cases(),
            fn (CommandClass $class) => in_array($class, $classes, true),
        )));
    }

    /**
     * @return list<string>
     */
    public function values(): array
    {
        return array_map(fn (CommandClass $class): string => $class->value, $this->classes);
    }

    /**
     * @param  list<string>  $names
     */
    public static function ofValues(array $names): self
    {
        return self::of(...array_map(CommandClass::from(...), $names));
    }

    public static function none(): self
    {
        return new self([]);
    }

    public function withClass(CommandClass $class): self
    {
        return self::of($class, ...$this->classes);
    }

    public function union(self $other): self
    {
        return self::of(...$this->classes, ...$other->classes);
    }

    public function contains(CommandClass $class): bool
    {
        return in_array($class, $this->classes, true);
    }

    public function isEmpty(): bool
    {
        return $this->classes === [];
    }

    /**
     * The classes of this set that the other set does not hold.
     */
    public function missingFrom(self $other): self
    {
        return self::of(...array_filter($this->classes, fn (CommandClass $class) => ! $other->contains($class)));
    }

    public function isWithin(self $other): bool
    {
        return $this->missingFrom($other)->isEmpty();
    }

    public function sharesAnyWith(self $other): bool
    {
        return array_any($this->classes, fn (CommandClass $class) => $other->contains($class));
    }
}
