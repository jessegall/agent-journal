<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Contracts\DomainAvailability;
use App\Registries\Support\Registry;
use App\Scripts\Contracts\ScriptObjectRegistration;
use App\Scripts\Exceptions\ScriptDefinitionRefused;
use App\Scripts\Values\ObjectDefinition;
use App\Scripts\Values\ScriptContext;
use Illuminate\Container\Container;
use PhpOption\Option;

final readonly class ObjectRegistry implements ScriptObjectRegistration
{
    /**
     * @var Registry<ObjectDefinition>
     */
    private Registry $objects;

    public function __construct(private ObjectReflection $reflection, private Container $container)
    {
        $this->objects = Registry::once(ScriptDefinitionRefused::unknown(...), ScriptDefinitionRefused::duplicate(...));
    }

    /**
     * @param  class-string  $class
     */
    public function register(string $class): void
    {
        $this->store($this->reflection->describe($class, 'Core'));
    }

    /**
     * @param  class-string  $class
     */
    public function registerOwned(string $owner, string $class): void
    {
        if ($owner === '' || strcasecmp($owner, 'Core') === 0) {
            throw ScriptDefinitionRefused::invalidOwner($owner);
        }

        $this->store($this->reflection->describe($class, $owner));
    }

    public function get(string $key): ObjectDefinition
    {
        return $this->objects->get($key);
    }

    /**
     * @return Option<ObjectDefinition>
     */
    public function find(string $key): Option
    {
        return $this->objects->find($key);
    }

    /**
     * @return list<ObjectDefinition>
     */
    public function all(): array
    {
        return array_values($this->objects->all());
    }

    public function isAvailable(ObjectDefinition $object): bool
    {
        return $this->container->make(DomainAvailability::class)->isEnabled($object->owner);
    }

    public function make(string $key, ScriptContext $context): object
    {
        $object = $this->get($key);

        if (! $this->isAvailable($object)) {
            throw ScriptDefinitionRefused::unavailable($key);
        }

        return $this->container->makeWith($object->class, [$object->contextParameter => $context]);
    }

    private function store(ObjectDefinition $object): void
    {
        $this->objects->put($object->key, $object);
    }
}
