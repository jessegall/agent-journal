<?php

declare(strict_types=1);

namespace App\Support;

use App\Engine\Enums\TypeShape;
use App\Exceptions\TypeNotNamed;
use ReflectionIntersectionType;
use ReflectionNamedType;
use ReflectionType;
use ReflectionUnionType;

/**
 * A type as PHP declares it on a property, parameter or return: one name, nullable or not, or a union or intersection
 * of types, written the way PHP writes it.
 */
final readonly class DeclaredType
{
    public TypeShape $shape;

    /**
     * The type as PHP writes it, such as ?int, A&B or int|string.
     */
    public string $text;

    public bool $allowsNull;

    /**
     * The types a union or intersection joins; none for a named type.
     *
     * @var list<DeclaredType>
     */
    public array $members;

    private string $name;

    private bool $isBuiltin;

    public function __construct(ReflectionType $type)
    {
        $this->text = (string) $type;
        $this->allowsNull = $type->allowsNull();

        $this->shape = match (true) {
            $type instanceof ReflectionUnionType => TypeShape::Union,
            $type instanceof ReflectionIntersectionType => TypeShape::Intersection,
            default => TypeShape::Named,
        };

        $this->members = $type instanceof ReflectionUnionType || $type instanceof ReflectionIntersectionType
            ? array_values(array_map(fn (ReflectionType $member) => new self($member), $type->getTypes()))
            : [];

        $this->name = $type instanceof ReflectionNamedType ? $type->getName() : '';
        $this->isBuiltin = $type instanceof ReflectionNamedType && $type->isBuiltin();
    }

    /**
     * Whether a value of this type could be the value: null where the type allows it, any member of a union, every
     * member of an intersection, a builtin by PHP's own test of it and a class by instanceof. Void and never accept
     * no value.
     */
    public function accepts(mixed $value): bool
    {
        if ($value === null) {
            return $this->allowsNull;
        }

        return match ($this->shape) {
            TypeShape::Union => array_any($this->members, fn (self $member) => $member->accepts($value)),
            TypeShape::Intersection => array_all($this->members, fn (self $member) => $member->accepts($value)),
            TypeShape::Named => $this->isBuiltin ? $this->isBuiltinMatch($value) : $value instanceof $this->name,
        };
    }

    /**
     * Whether it is void: what it types gives back nothing.
     */
    public function isVoid(): bool
    {
        return $this->shape === TypeShape::Named && $this->name === 'void';
    }

    public function isNamed(): bool
    {
        return $this->shape === TypeShape::Named;
    }

    /**
     * The one name of a named type, without its question mark, such as int or App\Thing.
     *
     * @throws TypeNotNamed
     */
    public function name(): string
    {
        if (! $this->isNamed()) {
            throw TypeNotNamed::for($this->text);
        }

        return $this->name;
    }

    /**
     * The class or interface a named type that is not one of PHP's own types names.
     *
     * @return class-string
     *
     * @throws TypeNotNamed
     */
    public function className(): string
    {
        if ($this->isBuiltin()) {
            throw TypeNotNamed::for($this->text);
        }

        // PHP names a class or an interface for every named type that is not one of its own.
        /** @var class-string $class */
        $class = $this->name();

        return $class;
    }

    /**
     * Whether it is one of PHP's own types, such as int, array or void, rather than a class.
     */
    public function isBuiltin(): bool
    {
        return $this->isBuiltin;
    }

    /**
     * Whether it is one of PHP's scalar types: int, float, string or bool.
     */
    public function isScalar(): bool
    {
        return $this->isNamed() && in_array($this->name, ['int', 'float', 'string', 'bool'], true);
    }

    /**
     * Whether it is exactly this one name, as a named type.
     */
    public function isNamedAs(string $name): bool
    {
        return $this->isNamed() && $this->name === $name;
    }

    private function isBuiltinMatch(mixed $value): bool
    {
        return match ($this->name) {
            'mixed' => true,
            'int' => is_int($value),
            'float' => is_float($value) || is_int($value),
            'string' => is_string($value),
            'bool' => is_bool($value),
            'true' => $value === true,
            'false' => $value === false,
            'array' => is_array($value),
            'iterable' => is_iterable($value),
            'object' => is_object($value),
            'callable' => is_callable($value),
            default => false,
        };
    }
}
