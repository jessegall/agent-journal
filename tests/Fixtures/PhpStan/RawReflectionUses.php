<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use ReflectionClass as NativeClass;

/**
 * Native reflection the reflection rule reports, one way per method.
 */
final class RawReflectionUses
{
    public string $label = '';

    public function aliasedConstructor(): object
    {
        return new NativeClass(self::class);
    }

    public function qualifiedMethod(): object
    {
        return new \ReflectionMethod(self::class, 'qualifiedMethod');
    }

    public function indirectProperty(): int
    {
        return count($this->property()->getAttributes());
    }

    public function attributeInstantiation(): void
    {
        foreach ($this->property()->getAttributes() as $attribute) {
            $attribute->newInstance();
        }
    }

    public function typeHint(\ReflectionNamedType|null $type): bool
    {
        return $type instanceof \ReflectionUnionType;
    }

    public function staticCall(): object
    {
        return \ReflectionMethod::createFromMethodName(self::class.'::staticCall');
    }

    public function dynamicConstruction(): object
    {
        $class = NativeClass::class;

        return new $class(self::class);
    }

    public function unknownReceiver(mixed $declaration): mixed
    {
        return $declaration?->getAttributes();
    }

    /**
     * @return \ReflectionProperty
     */
    private function property(): object
    {
        return new \ReflectionProperty(self::class, 'label');
    }

    public function typeQuestions(string $class, object $value): bool
    {
        return class_exists($class)
            && is_subclass_of($class, self::class)
            && method_exists($class, 'label')
            && $value instanceof $class;
    }
}
