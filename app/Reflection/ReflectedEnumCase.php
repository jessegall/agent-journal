<?php

declare(strict_types=1);

namespace App\Reflection;

use App\Reflection\Concerns\ReadsDeclaredAttributes;
use ReflectionEnumUnitCase;
use UnitEnum;

/**
 * One case of a reflected enum as PHP declares it: its name, the case itself and its attributes, read once.
 */
final class ReflectedEnumCase
{
    use ReadsDeclaredAttributes;

    private readonly DeclarationAttributes $declaredAttributes;

    public function __construct(private readonly ReflectionEnumUnitCase $case)
    {
        $label = "enum case {$case->getDeclaringClass()->getName()}::{$case->getName()}";
        $this->declaredAttributes = new DeclarationAttributes(fn () => $case->getAttributes(), $label);
    }

    public function name(): string
    {
        return $this->case->getName();
    }

    public function value(): UnitEnum
    {
        return $this->case->getValue();
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        return $this->declaredAttributes;
    }
}
