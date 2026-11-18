<?php

declare(strict_types=1);

namespace App\Bus\Support;

use BackedEnum;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionProperty;
use ReflectionType;

/**
 * What a command may carry and a handler may return (doc 19, section 6.7): whole numbers, text, yes or no and
 * decimals, backed enums, their nullable forms, lists of whole numbers, text or one enum, and allowed values, final
 * readonly classes the owner may name whose own properties follow the same grammar.
 */
final readonly class CommandGrammar
{
    private const array SCALARS = ['int', 'string', 'bool', 'float'];

    /**
     * @param  callable(string): bool  $mayName  whether the command's owner may name a value class
     */
    public function __construct(private mixed $mayName) {}

    /**
     * Why a property or a value's property falls outside the grammar, or null when every one fits.
     *
     * @param  class-string  $class
     * @param  list<string>  $seen  the value classes already walked, so a value holding itself ends
     */
    public function problemWithProperties(string $class, array $seen = []): string|null
    {
        $reflection = new ReflectionClass($class);

        foreach ($reflection->getProperties() as $property) {
            if (! $property->isPublic() || ! $property->isPromoted()) {
                return "{$property->getName()} is not a public constructor property";
            }

            $problem = $this->problemWithType($property->getType(), $property, [...$seen, $class]);

            if ($problem !== null) {
                return "{$property->getName()} {$problem}";
            }
        }

        return null;
    }

    /**
     * Why a handler's declared return type falls outside the grammar, or null when it fits.
     */
    public function problemWithResult(ReflectionType|null $type): string|null
    {
        if ($type instanceof ReflectionNamedType && $type->getName() === 'void') {
            return null;
        }

        return $this->problemWithType($type, null, []);
    }

    /**
     * @param  list<string>  $seen
     */
    private function problemWithType(ReflectionType|null $type, ReflectionProperty|null $property, array $seen): string|null
    {
        if (! $type instanceof ReflectionNamedType) {
            return 'has no single declared type';
        }

        $name = $type->getName();

        if (in_array($name, self::SCALARS, true)) {
            return null;
        }

        if ($name === 'array') {
            return $this->problemWithList($property);
        }

        if (enum_exists($name)) {
            return is_subclass_of($name, BackedEnum::class) ? null : "is the enum {$name}, which has no values";
        }

        return $this->problemWithValue($name, $seen);
    }

    private function problemWithList(ReflectionProperty|null $property): string|null
    {
        $doc = (string) ($property?->getDeclaringClass()->getConstructor()?->getDocComment() ?: $property?->getDocComment());

        if ($property === null || preg_match('/list<([A-Za-z\\\\]+)>\s+\$'.$property->getName().'\b/', $doc, $match) !== 1) {
            return 'is an array without a list<int>, list<string> or list of an enum docblock';
        }

        $item = ltrim($match[1], '\\');

        return in_array($item, ['int', 'string'], true) || $this->isBackedEnum($item, $property) ? null : "is a list of {$item}, not of whole numbers, text or an enum";
    }

    private function isBackedEnum(string $item, ReflectionProperty $property): bool
    {
        $class = str_contains($item, '\\') ? $item : $property->getDeclaringClass()->getNamespaceName().'\\'.$item;

        return enum_exists($class) && is_subclass_of($class, BackedEnum::class);
    }

    /**
     * @param  list<string>  $seen
     */
    private function problemWithValue(string $name, array $seen): string|null
    {
        if (! class_exists($name)) {
            return "is typed {$name}, which is no class, enum or allowed type";
        }

        $value = new ReflectionClass($name);

        if (! $value->isFinal() || ! $value->isReadOnly()) {
            return "holds {$name}, which is not a final readonly value";
        }

        if (! ($this->mayName)($name)) {
            return "holds {$name}, which the owner neither owns nor has exported to it";
        }

        if (in_array($name, $seen, true)) {
            return null;
        }

        $problem = $this->problemWithProperties($name, $seen);

        return $problem === null ? null : "holds {$name}, whose {$problem}";
    }
}
