<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\ScriptMember;
use App\Attributes\ScriptObject;
use App\Contracts\Authorization\OperationNames;
use App\Contracts\Reflection\ReflectorFactory;
use App\Exceptions\ScriptDefinitionRefused;
use App\Values\ObjectDefinition;
use App\Values\ObjectMember;
use App\Values\OperationKey;
use App\Values\ScriptContext;

final readonly class ObjectReflection
{
    public function __construct(private OperationNames $operations, private ReflectorFactory $reflectors) {}

    /**
     * @param  class-string  $class
     */
    public function describe(string $class, string $owner): ObjectDefinition
    {
        if ($this->reflectors->make($class)->not()->isClass()) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        $declaration = $this->reflectors->make($class);
        $objects = $declaration->attributes(ScriptObject::class);

        if (! $declaration->isInstantiable() || count($objects) !== 1) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        $key = $objects->first()->get()->key;

        if (preg_match('/^[a-z][a-z0-9_]*$/D', $key) !== 1) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        $members = [];

        foreach ($declaration->properties() as $property) {
            $marks = $property->attributes(ScriptMember::class);

            if (count($marks) === 0) {
                continue;
            }

            if (count($marks) !== 1) {
                throw ScriptDefinitionRefused::invalidMember($class, $property->name());
            }

            $member = $this->member($class, $property, $marks->first()->get());
            $members[$member->name] = $member;
        }

        if ($members === []) {
            throw ScriptDefinitionRefused::invalidObject($class);
        }

        return new ObjectDefinition($key, $class, $owner, $this->contextParameter($declaration), $members);
    }

    private function member(string $class, ReflectedProperty $property, ScriptMember $member): ObjectMember
    {
        $isPlainBool = $property->type()
            ->filter(fn (DeclaredType $type) => $type->isNamedAs('bool') && ! $type->allowsNull)
            ->isDefined();

        if (! $property->isPublic() || $property->isStatic() || ! $isPlainBool || $property->hasSetHook()
            || ! $this->operations->has($member->read)) {
            throw ScriptDefinitionRefused::invalidMember($class, $property->name());
        }

        return new ObjectMember($property->name(), new OperationKey($member->read));
    }

    /**
     * @param  Reflector<object>  $class
     */
    private function contextParameter(Reflector $class): string
    {
        if ($class->constructor()->isEmpty()) {
            throw ScriptDefinitionRefused::invalidObject($class->name());
        }

        $contexts = [];

        foreach ($class->constructor()->get()->parameters() as $parameter) {
            $named = $parameter->type()->filter(fn (DeclaredType $type) => $type->isNamed());

            if ($named->filter(fn (DeclaredType $type) => $type->isNamedAs(ScriptContext::class) && ! $type->allowsNull)
                ->isDefined()) {
                $contexts[] = $parameter->name();

                continue;
            }

            if (! $parameter->isOptional()
                && ($named->isEmpty() || $named->get()->isBuiltin())) {
                throw ScriptDefinitionRefused::invalidObject($class->name());
            }
        }

        if (count($contexts) !== 1) {
            throw ScriptDefinitionRefused::invalidObject($class->name());
        }

        return $contexts[0];
    }
}
