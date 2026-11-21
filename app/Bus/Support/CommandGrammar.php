<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Files\Support\CodeFiles;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\ReflectedProperty;
use App\Reflection\Support\Reflector;
use BackedEnum;
use PhpOption\Option;

/**
 * What a command may carry and a handler may return (doc 19, section 6.7): whole numbers, text, yes or no and
 * decimals, backed enums, their nullable forms, allowed values (final readonly classes the owner may name whose own
 * properties follow the same grammar), and lists of whole numbers, text, one enum or one allowed value.
 */
final readonly class CommandGrammar
{
    private const array SCALARS = ['int', 'string', 'bool', 'float'];

    private const string UNLISTED_ARRAY = 'is an array without a list<int>, list<string>, list of an enum or list of '
        .'a value docblock';

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
        foreach (Reflector::of($class)->properties() as $property) {
            if (! $property->isPublic() || ! $property->isPromoted()) {
                return "{$property->name()} is not a public constructor property";
            }

            $problem = $this->problemWithType($property->type(), $property, [...$seen, $class]);

            if ($problem !== null) {
                return "{$property->name()} {$problem}";
            }
        }

        return null;
    }

    /**
     * Why a handler method's declared return type falls outside the grammar, or null when it fits.
     */
    public function problemWithResult(ReflectedMethod $handle): string|null
    {
        $type = $handle->returnType();

        if ($type->isDefined() && $type->get()->isNamedAs('void')) {
            return null;
        }

        return $this->problemWithType($type, null, []);
    }

    /**
     * @param  Option<DeclaredType>  $type
     * @param  list<string>  $seen
     */
    private function problemWithType(Option $type, ReflectedProperty|null $property, array $seen): string|null
    {
        if (! $type->isDefined() || ! $type->get()->isNamed()) {
            return 'has no single declared type';
        }

        $name = $type->get()->name();

        if (in_array($name, self::SCALARS, true)) {
            return null;
        }

        if ($name === 'array') {
            return $this->problemWithList($property, $seen);
        }

        $enum = Reflector::find($name)->filter(fn (Reflector $type) => $type->isEnum());

        if ($enum->isDefined()) {
            return $enum->get()->implements(BackedEnum::class)
                ? null
                : "is the enum {$name}, which has no values";
        }

        return $this->problemWithValue($name, $seen);
    }

    /**
     * @param  list<string>  $seen
     */
    private function problemWithList(ReflectedProperty|null $property, array $seen): string|null
    {
        if ($property === null) {
            return self::UNLISTED_ARRAY;
        }

        $doc = $property->declaringClass()->constructor()
            ->flatMap(fn (ReflectedMethod $constructor) => $constructor->docComment())
            ->orElse($property->docComment())
            ->getOrElse('');

        if (preg_match('/list<([A-Za-z\\\\]+)>(?:\|null)?\s+\$'.$property->name().'\b/', $doc, $match) !== 1) {
            return self::UNLISTED_ARRAY;
        }

        $elementType = ltrim($match[1], '\\');

        if (in_array($elementType, ['int', 'string'], true)) {
            return null;
        }

        $class = $this->classNamed($elementType, $property);

        $item = Reflector::find($class);

        if ($item->filter(fn (Reflector $type) => $type->isEnum())->isDefined()) {
            return $item->get()->implements(BackedEnum::class)
                ? null
                : "is a list of the enum {$class}, which has no values";
        }

        $problem = $item->filter(fn (Reflector $type) => $type->isClass())->isDefined() ? $this->problemWithValue(
            $class,
            $seen,
        ) : "is typed {$class}, which is no class, enum or allowed type";

        return $problem === null ? null : "is a list whose item {$problem}";
    }

    /**
     * The class a docblock names: a full name as written, a short one through the file's imports, else in the
     * declaring class's namespace, as PHP itself would read it.
     */
    private function classNamed(string $elementType, ReflectedProperty $property): string
    {
        if (str_contains($elementType, '\\')) {
            return $elementType;
        }

        $class = $property->declaringClass();

        return self::importsOf($class->fileName()->getOrElse(''))[$elementType]
            ?? $class->namespaceName().'\\'.$elementType;
    }

    /**
     * The classes a file of the project's code imports, by the short name or alias they are used under, from the
     * process's one read of the file.
     *
     * @return array<string, string>
     */
    private static function importsOf(string $file): array
    {
        $code = CodeFiles::ofProcess();
        preg_match_all(
            '/^use\s+([A-Za-z0-9_\\\\]+)(?:\s+as\s+([A-Za-z0-9_]+))?;/m',
            $code->file($code->projectPathOf($file)),
            $imports,
            PREG_SET_ORDER,
        );
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
        $found = Reflector::find($name)->filter(fn (Reflector $type) => $type->isClass());

        if ($found->isEmpty()) {
            return "is typed {$name}, which is no class, enum or allowed type";
        }

        $declaration = $found->get();

        if (! $declaration->isFinal() || ! $declaration->isReadOnly()) {
            return "holds {$name}, which is not a final readonly value";
        }

        if (! ($this->mayName)($name)) {
            return "holds {$name}, which the owner neither owns nor has exported to it";
        }

        if (in_array($name, $seen, true)) {
            return null;
        }

        $problem = $this->problemWithProperties($declaration->name(), $seen);

        return $problem === null ? null : "holds {$name}, whose {$problem}";
    }
}
