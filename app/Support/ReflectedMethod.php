<?php

declare(strict_types=1);

namespace App\Support;

use App\Reflection\Concerns\ReadsDeclaredAttributes;
use App\Reflection\DeclarationAttributes;
use Closure;
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

    private DeclarationAttributes $declaredAttributes;

    /**
     * @var list<ReflectedParameter>
     */
    private array $parameters;

    /**
     * @var Option<DeclaredType>
     */
    private Option $returnType;

    private readonly string $label;

    /**
     * @param  Closure(class-string): Reflector<object>  $reflectorOf  answers the Reflector of a declaring class
     */
    public function __construct(private readonly ReflectionMethod $method, private readonly Closure $reflectorOf)
    {
        $this->label = "method {$method->getDeclaringClass()->getName()}::{$method->getName()}()";
    }

    public function name(): string
    {
        return $this->method->getName();
    }

    public function isPublic(): bool
    {
        return $this->method->isPublic();
    }

    public function isPrivate(): bool
    {
        return $this->method->isPrivate();
    }

    public function isStatic(): bool
    {
        return $this->method->isStatic();
    }

    public function isAbstract(): bool
    {
        return $this->method->isAbstract();
    }

    public function isFinal(): bool
    {
        return $this->method->isFinal();
    }

    /**
     * Calls the method on the object with these arguments, on every call, whatever its visibility.
     */
    public function invokeOn(object $target, mixed ...$arguments): mixed
    {
        return $this->method->invoke($target, ...$arguments);
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

    /**
     * The class or interface the first parameter is typed on; none for no parameter, a builtin or a union type.
     *
     * @return Option<string>
     */
    public function firstParameterClass(): Option
    {
        $parameters = $this->parameters();

        return ($parameters === [] ? None::create() : $parameters[0]->type())
            ->filter(fn (DeclaredType $type) => $type->namesClass())
            ->map(fn (DeclaredType $type) => $type->name());
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
        $this->returnType = $type === null ? None::create() : new Some(new DeclaredType($type));

        return $this->returnType;
    }

    /**
     * @return Option<string>
     */
    public function docComment(): Option
    {
        $comment = $this->method->getDocComment();

        if ($comment === false) {
            return None::create();
        }

        return new Some($comment);
    }

    /**
     * The line the method starts on in its file; 0 for one PHP declares.
     */
    public function startLine(): int
    {
        return (int) $this->method->getStartLine();
    }

    /**
     * The file that declares the method, which for a trait method is the trait's file; none for one PHP declares.
     *
     * @return Option<string>
     */
    public function fileName(): Option
    {
        $file = $this->method->getFileName();

        if ($file === false) {
            return None::create();
        }

        return new Some($file);
    }

    /**
     * The class that declares the method, which may be a parent of the class it was read from.
     *
     * @return Reflector<object>
     */
    public function declaringClass(): Reflector
    {
        return ($this->reflectorOf)($this->method->getDeclaringClass()->getName());
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        $method = $this->method;

        return $this->declaredAttributes ??= new DeclarationAttributes(
            static fn () => $method->getAttributes(),
            $this->label,
        );
    }
}
