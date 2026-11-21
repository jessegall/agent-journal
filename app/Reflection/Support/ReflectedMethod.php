<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use ReflectionMethod;
use ReflectionParameter;

/**
 * One method of a reflected class as PHP reflects it for that class, inherited or its own: its name, visibility,
 * parameters, return type, docblock, declaring class and attributes, read once.
 */
final class ReflectedMethod
{
    use ReadsDeclaredAttributes;

    private readonly DeclarationAttributes $declaredAttributes;

    /**
     * @var list<ReflectedParameter>
     */
    private array $parameters;

    /**
     * @var Option<DeclaredType>
     */
    private Option $returnType;

    private readonly string $label;

    public function __construct(private readonly ReflectionMethod $method)
    {
        $this->label = "method {$method->getDeclaringClass()->getName()}::{$method->getName()}()";
        $this->declaredAttributes = new DeclarationAttributes(fn () => $method->getAttributes(), $this->label);
    }

    public function name(): string
    {
        return $this->method->getName();
    }

    public function isPublic(): bool
    {
        return $this->method->isPublic();
    }

    public function isStatic(): bool
    {
        return $this->method->isStatic();
    }

    /**
     * @return list<ReflectedParameter>
     */
    public function parameters(): array
    {
        return $this->parameters ??= array_map(
            fn (ReflectionParameter $parameter) => new ReflectedParameter($parameter, $this->label),
            $this->method->getParameters(),
        );
    }

    public function requiredParameterCount(): int
    {
        return $this->method->getNumberOfRequiredParameters();
    }

    /**
     * The declared return type; none when the method declares none.
     *
     * @return Option<DeclaredType>
     */
    public function returnType(): Option
    {
        if (isset($this->returnType)) {
            return $this->returnType;
        }

        $type = $this->method->getReturnType();

        return $this->returnType = $type === null ? None::create() : new Some(new DeclaredType($type));
    }

    /**
     * @return Option<string>
     */
    public function docComment(): Option
    {
        $comment = $this->method->getDocComment();

        return $comment === false ? None::create() : new Some($comment);
    }

    /**
     * The class that declares the method, which may be a parent of the class it was read from.
     *
     * @return Reflector<object>
     */
    public function declaringClass(): Reflector
    {
        return Reflector::of($this->method->getDeclaringClass()->getName());
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        return $this->declaredAttributes;
    }
}
