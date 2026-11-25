<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Reflection\ClassMemberReflection;
use PHPStan\Reflection\ClassReflection;
use PHPStan\Reflection\ExtendedMethodReflection;
use PHPStan\Reflection\FunctionVariant;
use PHPStan\Reflection\MethodReflection;
use PHPStan\Reflection\ParametersAcceptor;
use PHPStan\TrinaryLogic;
use PHPStan\Type\ClosureType;
use PHPStan\Type\Generic\TemplateTypeMap;
use PHPStan\Type\NeverType;
use PHPStan\Type\Type;

/**
 * One call of a ThrowingCall as PHPStan reads it: the exception factory's parameters, answering a closure that never
 * returns.
 */
final readonly class ThrowingFactoryMethod implements MethodReflection
{
    public function __construct(private ClassReflection $proxy, private ExtendedMethodReflection $factory) {}

    public function getDeclaringClass(): ClassReflection
    {
        return $this->proxy;
    }

    public function isStatic(): bool
    {
        return false;
    }

    public function isPrivate(): bool
    {
        return false;
    }

    public function isPublic(): bool
    {
        return true;
    }

    public function getDocComment(): string|null
    {
        return null;
    }

    public function getName(): string
    {
        return $this->factory->getName();
    }

    public function getPrototype(): ClassMemberReflection
    {
        return $this;
    }

    /**
     * @return list<ParametersAcceptor>
     */
    public function getVariants(): array
    {
        $closure = new ClosureType([], new NeverType(true), false);

        return array_map(
            fn (ParametersAcceptor $acceptor) => new FunctionVariant(
                TemplateTypeMap::createEmpty(),
                null,
                $acceptor->getParameters(),
                $acceptor->isVariadic(),
                $closure,
            ),
            $this->factory->getVariants(),
        );
    }

    public function isDeprecated(): TrinaryLogic
    {
        return TrinaryLogic::createNo();
    }

    public function getDeprecatedDescription(): string|null
    {
        return null;
    }

    public function isFinal(): TrinaryLogic
    {
        return TrinaryLogic::createYes();
    }

    public function isInternal(): TrinaryLogic
    {
        return TrinaryLogic::createNo();
    }

    public function getThrowType(): Type|null
    {
        return null;
    }

    public function hasSideEffects(): TrinaryLogic
    {
        return TrinaryLogic::createNo();
    }
}
