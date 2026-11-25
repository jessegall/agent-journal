<?php

declare(strict_types=1);

namespace App\Support;

use App\Concerns\ReadsDeclaredAttributes;
use Closure;
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

    /**
     * @param  Closure(class-string): Reflector<object>  $reflectorOf  answers the Reflector of a declaring class
     */
    public function __construct(private readonly ReflectionProperty $property, private readonly Closure $reflectorOf)
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

    public function isStatic(): bool
    {
        return $this->property->isStatic();
    }

    public function isReadOnly(): bool
    {
        return $this->property->isReadOnly();
    }

    public function isPrivate(): bool
    {
        return $this->property->isPrivate();
    }

    /**
     * The property's current value on the object, read on every call, whatever its visibility.
     */
    public function readFrom(object $target): mixed
    {
        return $this->property->getValue($target);
    }

    /**
     * Writes the value to the property on the object, on every call, whatever its visibility.
     */
    public function writeTo(object $target, mixed $value): void
    {
        $this->property->setValue($target, $value);
    }

    /**
     * A static property's current value, read on every call.
     */
    public function readStatic(): mixed
    {
        return $this->property->getValue();
    }

    /**
     * Writes the value to a static property, on every call.
     */
    public function writeStatic(mixed $value): void
    {
        $this->property->setValue(null, $value);
    }

    /**
     * Whether the property stores nothing: every read and write goes through its hooks.
     */
    public function isVirtual(): bool
    {
        return $this->property->isVirtual();
    }

    /**
     * Whether the property declares a set hook.
     */
    public function hasSetHook(): bool
    {
        return isset($this->property->getHooks()['set']);
    }

    /**
     * The value the declaration gives the property; null when it gives none.
     */
    public function defaultValue(): mixed
    {
        return $this->property->getDefaultValue();
    }

    /**
     * Whether the property is declared in the constructor's parameters.
     */
    /**
     * Marks the property of a lazy object as set, so reading it leaves the object uninitialized.
     */
    public function skipLazyInitialization(object $object): void
    {
        $this->property->skipLazyInitialization($object);
    }

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

        if ($comment === false) {
            return None::create();
        }

        return new Some($comment);
    }

    /**
     * The class that declares the property, which may be a parent of the class it was read from.
     *
     * @return Reflector<object>
     */
    public function declaringClass(): Reflector
    {
        return ($this->reflectorOf)($this->property->getDeclaringClass()->getName());
    }

    /**
     * @return Option<DeclaredType>
     */
    private static function typeOf(ReflectionProperty $property): Option
    {
        $type = $property->getType();

        if ($type === null) {
            return None::create();
        }

        return new Some(new DeclaredType($type));
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        return $this->declaredAttributes;
    }
}
