<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Access\Contracts\VisibilityCheck;
use App\Events\Web\WebEvent;
use App\Reflection\ReflectedProperty;
use App\Support\Reflector;
use App\Web\Attributes\AppendBy;
use App\Web\Attributes\Bounded;
use App\Web\Attributes\CopyScoped;
use App\Web\Attributes\Deferred;
use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\Paged;
use App\Web\Attributes\PermissionGated;
use App\Web\Attributes\RecordScoped;
use App\Web\Attributes\RowIdentity;
use App\Web\Attributes\WindowOnly;
use App\Web\Creation\Exceptions\InvalidSurfacePolicy;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Spatie\LaravelData\Attributes\InjectsPropertyValue;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\DataConfig;
use Spatie\LaravelData\Support\DataProperty;

final class SurfaceAttributeMap
{
    /** @var array<class-string<Data>, SurfacePolicy> */
    private array $policies = [];

    public function __construct(private readonly DataConfig $data) {}

    /** @param class-string<Data> $type */
    public function forPage(string $type): SurfacePolicy
    {
        if (Reflector::of($type)->hasAttribute(WindowOnly::class)) {
            throw InvalidSurfacePolicy::at($type, 'A window-only type cannot be registered as a page.');
        }

        return $this->forType($type);
    }

    /** @param class-string<Data> $type */
    public function forType(string $type): SurfacePolicy
    {
        return $this->policies[$type] ??= $this->compile($type);
    }

    /** @param class-string<Data> $type */
    private function compile(string $type): SurfacePolicy
    {
        $class = Reflector::of($type);
        $paging = $class->attributes(Paged::class)->first()->getOrElse(null);

        if ($paging !== null && ($paging->size < 1 || trim($paging->parameter) === '')) {
            throw InvalidSurfacePolicy::at($type, 'Paging needs a query parameter and a positive size.');
        }

        $checks = [];

        foreach ($class->attributes(PermissionGated::class) as $guard) {
            if (! is_subclass_of($guard->check, VisibilityCheck::class)) {
                throw InvalidSurfacePolicy::at($type, "{$guard->check} is not a visibility check.");
            }

            $checks[] = $guard->check;
        }

        $bounds = [];
        $properties = [];
        $appendKeys = [];
        $classAppend = $class->attributes(AppendBy::class)->first()->getOrElse(null);

        foreach ($this->data->getDataClass($type)->properties as $property) {
            $field = $class->property($property->name);
            $location = $type.'::'.$field->name();
            $properties[$field->name()] = $this->prop($field, $location);
            $this->assertInputSource($field, $location);
            $bound = $field->attributes(Bounded::class)->first()->getOrElse(null);

            if ($bound !== null) {
                $bounds[$field->name()] = $this->bound($property, $bound, $location);
            }

            $append = $field->attributes(AppendBy::class)->first()
                ->getOrElse($property->type->kind->isDataCollectable() ? $classAppend : null);

            if ($append !== null && $this->hasRowIdentity($property, $append)) {
                $appendKeys[$field->name()] = $append->key;
            }

            if ($field->hasAttribute(AppendBy::class) && ! isset($appendKeys[$field->name()])) {
                throw InvalidSurfacePolicy::at($location, 'The append key must mark a string row identity.');
            }
        }

        if ($classAppend !== null && $appendKeys === []) {
            throw InvalidSurfacePolicy::at($type, 'The append key must mark a string row identity.');
        }

        return new SurfacePolicy(
            type: $type,
            prop: $this->prop($class, $type),
            properties: $properties,
            checks: $checks,
            recordScope: $class->attributes(RecordScoped::class)->first()->getOrElse(null),
            paging: $paging,
            bounds: $bounds,
            isCopyScoped: $class->hasAttribute(CopyScoped::class),
            appendKeys: $appendKeys,
        );
    }

    /** @param Reflector<object>|ReflectedProperty $declaration */
    private function prop(Reflector|ReflectedProperty $declaration, string $location): SurfacePropPolicy
    {
        $live = $declaration->attributes(Live::class)->first()->getOrElse(null);

        foreach ($live?->events ?? [] as $event) {
            if (! is_subclass_of($event, WebEvent::class) || ! is_subclass_of($event, ShouldBroadcast::class)) {
                throw InvalidSurfacePolicy::at($location, "{$event} is not a web broadcast event.");
            }
        }

        return new SurfacePropPolicy(
            $location,
            $declaration->attributes(Deferred::class)->first()->getOrElse(null),
            $declaration->hasAttribute(OptionalProp::class),
            $live,
        );
    }

    private function assertInputSource(ReflectedProperty $property, string $location): void
    {
        if ($property->attributesImplementing(InjectsPropertyValue::class)->count() > 1) {
            throw InvalidSurfacePolicy::at($location, 'A property can name only one input source.');
        }
    }

    /** @return positive-int */
    private function bound(DataProperty $property, Bounded $bound, string $location): int
    {
        if ($bound->limit < 1 || ! $property->type->kind->isDataCollectable()) {
            throw InvalidSurfacePolicy::at($location, 'A bound needs a typed Data collection and a positive limit.');
        }

        return $bound->limit;
    }

    private function hasRowIdentity(DataProperty $property, AppendBy $append): bool
    {
        $row = $property->type->dataClass;

        if ($row === null || ! $property->type->kind->isDataCollectable()) {
            return false;
        }

        $class = Reflector::of($row);

        if (! $class->hasProperty($append->key)) {
            return false;
        }

        $identity = $class->property($append->key);

        return $identity->hasAttribute(RowIdentity::class)
            && $identity->type()->filter(fn ($type) => $type->isNamedAs('string') && ! $type->allowsNull)->isDefined();
    }
}
