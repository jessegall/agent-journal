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
 * decimals, backed enums, their nullable forms, allowed values (final readonly classes the owner may name whose own
 * properties follow the same grammar), and lists of whole numbers, text, one enum or one allowed value.
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
            return $this->problemWithList($property, $seen);
        }

        if (enum_exists($name)) {
            return is_subclass_of($name, BackedEnum::class) ? null : "is the enum {$name}, which has no values";
        }

        return $this->problemWithValue($name, $seen);
    }

    /**
     * @param  list<string>  $seen
     */
    private function problemWithList(ReflectionProperty|null $property, array $seen): string|null
    {
        $doc = (string) ($property?->getDeclaringClass()->getConstructor()?->getDocComment() ?: $property?->getDocComment());

        if ($property === null || preg_match('/list<([A-Za-z\\\\]+)>\s+\$'.$property->getName().'\b/', $doc, $match) !== 1) {
            return 'is an array without a list<int>, list<string>, list of an enum or list of a value docblock';
        }

        $item = ltrim($match[1], '\\');

        if (in_array($item, ['int', 'string'], true)) {
            return null;
        }

        $class = $this->classNamed($item, $property);

        if (enum_exists($class)) {
            return is_subclass_of($class, BackedEnum::class) ? null : "is a list of the enum {$class}, which has no values";
        }

        $problem = class_exists($class) ? $this->problemWithValue($class, $seen) : "is typed {$class}, which is no class, enum or allowed type";

        return $problem === null ? null : "is a list whose item {$problem}";
    }

    /**
     * The class a docblock names: a full name as written, a short one through the file's imports, else in the
     * declaring class's namespace, as PHP itself would read it.
     */
    private function classNamed(string $item, ReflectionProperty $property): string
    {
        if (str_contains($item, '\\')) {
            return $item;
        }

        $class = $property->getDeclaringClass();

        return self::importsOf((string) $class->getFileName())[$item] ?? $class->getNamespaceName().'\\'.$item;
    }

    /**
     * The classes a file imports, by the short name or alias they are used under.
     *
     * @return array<string, string>
     */
    private static function importsOf(string $file): array
    {
        preg_match_all('/^use\s+([A-Za-z0-9_\\\\]+)(?:\s+as\s+([A-Za-z0-9_]+))?;/m', (string) file_get_contents($file), $imports, PREG_SET_ORDER);
        $byName = [];

        foreach ($imports as $import) {
            $byName[$import[2] ?? substr((string) strrchr('\\'.$import[1], '\\'), 1)] = $import[1];
        }

        return $byName;
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
