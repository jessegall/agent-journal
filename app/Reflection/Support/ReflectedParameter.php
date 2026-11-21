<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use ReflectionParameter;

/**
 * One parameter of a reflected method as PHP declares it: its name, position, type and attributes.
 */
final class ReflectedParameter
{
    use ReadsDeclaredAttributes;

    private readonly DeclarationAttributes $declaredAttributes;

    /**
     * @var Option<DeclaredType>
     */
    private Option $type;

    public function __construct(private readonly ReflectionParameter $parameter, string $method)
    {
        $label = "parameter \${$parameter->getName()} of {$method}";
        $this->declaredAttributes = new DeclarationAttributes(fn () => $parameter->getAttributes(), $label);
    }

    public function name(): string
    {
        return $this->parameter->getName();
    }

    public function position(): int
    {
        return $this->parameter->getPosition();
    }

    public function isOptional(): bool
    {
        return $this->parameter->isOptional();
    }

    /**
     * Whether null may be passed, by its type or by a null default.
     */
    public function allowsNull(): bool
    {
        return $this->parameter->allowsNull();
    }

    public function isVariadic(): bool
    {
        return $this->parameter->isVariadic();
    }

    public function isPassedByReference(): bool
    {
        return $this->parameter->isPassedByReference();
    }

    public function hasDefaultValue(): bool
    {
        return $this->parameter->isDefaultValueAvailable();
    }

    /**
     * The default value, evaluated as PHP evaluates it; read hasDefaultValue() first.
     */
    public function defaultValue(): mixed
    {
        return $this->parameter->getDefaultValue();
    }

    /**
     * The constant the default names, such as self::LIMIT; none when the default is no constant or there is none.
     *
     * @return Option<string>
     */
    public function defaultConstantName(): Option
    {
        if (! $this->hasDefaultValue() || ! $this->parameter->isDefaultValueConstant()) {
            return None::create();
        }

        return Option::fromValue($this->parameter->getDefaultValueConstantName());
    }

    /**
     * The declared type; none for an untyped parameter.
     *
     * @return Option<DeclaredType>
     */
    public function type(): Option
    {
        if (isset($this->type)) {
            return $this->type;
        }

        $type = $this->parameter->getType();

        return $this->type = $type === null ? None::create() : new Some(new DeclaredType($type));
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        return $this->declaredAttributes;
    }
}
