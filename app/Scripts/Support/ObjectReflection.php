<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Agents\Values\OperationKey;
use App\Profiles\Contracts\OperationNames;
use App\Scripts\Attributes\ScriptMember;
use App\Scripts\Attributes\ScriptObject;
use App\Scripts\Exceptions\ScriptDefinitionRefused;
use App\Scripts\Values\ObjectDefinition;
use App\Scripts\Values\ObjectMember;
use App\Scripts\Values\ScriptContext;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionProperty;

final readonly class ObjectReflection
{
    public function __construct(private OperationNames $operations) {}

    /** @param class-string $class */
    public function describe(string $class, string $owner): ObjectDefinition
    {
        if (! class_exists($class)) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        $reflection = new ReflectionClass($class);
        $attributes = $reflection->getAttributes(ScriptObject::class);

        if (! $reflection->isInstantiable() || count($attributes) !== 1) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        $key = $attributes[0]->newInstance()->key;

        if (preg_match('/^[a-z][a-z0-9_]*$/D', $key) !== 1) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        $members = [];

        foreach ($reflection->getProperties() as $property) {
            $attributes = $property->getAttributes(ScriptMember::class);

            if ($attributes === []) {
                continue;
            }

            if (count($attributes) !== 1) {
                throw ScriptDefinitionRefused::invalidMember($class, $property->getName());
            }

            $member = $this->member($class, $property, $attributes[0]->newInstance());
            $members[$member->name] = $member;
        }

        if ($members === []) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        return new ObjectDefinition($key, $class, $owner, $this->contextParameter($reflection), $members);
    }

    private function member(string $class, ReflectionProperty $property, ScriptMember $member): ObjectMember
    {
        $type = $property->getType();

        if (! $property->isPublic() || $property->isStatic() || ! $type instanceof ReflectionNamedType
            || $type->getName() !== 'bool' || $type->allowsNull() || isset($property->getHooks()['set'])
            || ! $this->operations->has($member->read)) {
            throw ScriptDefinitionRefused::invalidMember($class, $property->getName());
        }

        return new ObjectMember($property->getName(), new OperationKey($member->read));
    }

    /** @param ReflectionClass<object> $class */
    private function contextParameter(ReflectionClass $class): string
    {
        $constructor = $class->getConstructor();

        if ($constructor === null) {
            throw ScriptDefinitionRefused::invalidObject($class->getName());
        }

        $contexts = [];

        foreach ($constructor->getParameters() as $parameter) {
            $type = $parameter->getType();

            if ($type instanceof ReflectionNamedType && $type->getName() === ScriptContext::class
                && ! $type->allowsNull()) {
                $contexts[] = $parameter->getName();
                continue;
            }

            if (! $parameter->isOptional() && (! $type instanceof ReflectionNamedType || $type->isBuiltin())) {
                throw ScriptDefinitionRefused::invalidObject($class->getName());
            }
        }

        if (count($contexts) !== 1) {
            throw ScriptDefinitionRefused::invalidObject($class->getName());
        }

        return $contexts[0];
    }
}
