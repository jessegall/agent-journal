<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use ReflectionProperty;

/**
 * One property of a reflected class as PHP declares it: its name, visibility, type, docblock, declaring class and
 * attributes, read once.
 */
final class ReflectedProperty
{
    use ReadsDeclaredAttributes;

    private readonly DeclarationAttributes $declaredAttributes;

    /**
     * @var Option<DeclaredType>
     */
    private Option $type;

    public function __construct(private readonly ReflectionProperty $property)
    {
        $label = "property {$property->getDeclaringClass()->getName()}::\${$property->getName()}";
        $this->declaredAttributes = new DeclarationAttributes(fn () => $property->getAttributes(), $label);
    }

    public function name(): string
    {
        return $this->property->getName();
    }

    public function isPublic(): bool
    {
        return $this->property->isPublic();
    }

    /**
     * Whether the property is declared in the constructor's parameters.
     */
    public function isPromoted(): bool
    {
        return $this->property->isPromoted();
    }

    /**
     * The declared type; none for an untyped property.
     *
     * @return Option<DeclaredType>
     */
    public function type(): Option
    {
        return $this->type ??= self::typeOf($this->property);
    }

    /**
     * @return Option<string>
     */
    public function docComment(): Option
    {
        $comment = $this->property->getDocComment();

        return $comment === false ? None::create() : new Some($comment);
    }

    /**
     * The class that declares the property, which may be a parent of the class it was read from.
     *
     * @return Reflector<object>
     */
    public function declaringClass(): Reflector
    {
        return Reflector::of($this->property->getDeclaringClass()->getName());
    }

    /**
     * @return Option<DeclaredType>
     */
    private static function typeOf(ReflectionProperty $property): Option
    {
        $type = $property->getType();

        return $type === null ? None::create() : new Some(new DeclaredType($type));
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        return $this->declaredAttributes;
    }
}
