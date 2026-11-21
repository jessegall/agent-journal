<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Enums\TypeShape;
use App\Reflection\Exceptions\TypeNotNamed;
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

    private bool $builtin;

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
        $this->builtin = $type instanceof ReflectionNamedType && $type->isBuiltin();
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
     * Whether it is one of PHP's own types, such as int, array or void, rather than a class.
     */
    public function isBuiltin(): bool
    {
        return $this->builtin;
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
}
