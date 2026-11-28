<?php

declare(strict_types=1);

namespace App\Web\Attributes\Concerns;

use App\Web\Creation\Exceptions\InvalidSurfaceInput;
use App\Web\Creation\SurfaceContext;
use App\Web\Creation\SurfacePayload;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

trait InjectsSurfaceValue
{
    /** Reads the attribute's source from the admitted visit. */
    abstract private function read(SurfaceContext $context, DataProperty $property): mixed;

    /**
     * @param  array<string, mixed>  $properties
     * @param  CreationContext<Data>  $creationContext
     */
    final public function resolve(
        DataProperty $dataProperty,
        mixed $payload,
        array $properties,
        CreationContext $creationContext,
    ): mixed {
        if (! $payload instanceof SurfacePayload) {
            throw InvalidSurfaceInput::context($dataProperty->className, $dataProperty->name);
        }

        return $this->withDefault($dataProperty, $this->read($payload->context(), $dataProperty));
    }

    private function withDefault(DataProperty $dataProperty, mixed $value): mixed
    {
        if ($value !== null || $dataProperty->type->isNullable) {
            return $value;
        }

        if ($dataProperty->hasDefaultValue) {
            return $dataProperty->defaultValue;
        }

        if ($dataProperty->type->isOptional) {
            return Optional::create();
        }

        throw InvalidSurfaceInput::missing($dataProperty->className, $dataProperty->name);
    }

    final public function shouldBeReplacedWhenPresentInPayload(): bool
    {
        return true;
    }
}
