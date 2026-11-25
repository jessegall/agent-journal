<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use App\Exceptions\Support\ThrowingCall;
use PHPStan\Reflection\ClassReflection;
use PHPStan\Reflection\MethodReflection;
use PHPStan\Reflection\MethodsClassReflectionExtension;
use PHPStan\Reflection\ReflectionProvider;

/**
 * Gives PHPStan the calls of a ThrowingCall: each static factory of its exception, with the factory's own parameters,
 * answering a closure that throws, where the @mixin alone would answer the exception.
 */
final readonly class ThrowingCallMethods implements MethodsClassReflectionExtension
{
    public function __construct(private ReflectionProvider $reflections) {}

    public function hasMethod(ClassReflection $classReflection, string $methodName): bool
    {
        $exception = $this->exceptionOf($classReflection);

        return $exception instanceof ClassReflection && $exception->hasNativeMethod($methodName);
    }

    public function getMethod(ClassReflection $classReflection, string $methodName): MethodReflection
    {
        $exception = $this->exceptionOf($classReflection);
        $factory = $exception->getNativeMethod($methodName);

        return new ThrowingFactoryMethod($classReflection, $factory);
    }

    /**
     * The exception the proxy throws, as its template names it; none for another class or an unresolved template.
     */
    private function exceptionOf(ClassReflection $classReflection): ClassReflection|null
    {
        $type = $classReflection->getName() === ThrowingCall::class
            ? $classReflection->getActiveTemplateTypeMap()->getType('TException')
            : null;
        $name = $type?->getObjectClassNames()[0] ?? null;

        if ($name === null || ! $this->reflections->hasClass($name)) {
            return null;
        }

        return $this->reflections->getClass($name);
    }
}
