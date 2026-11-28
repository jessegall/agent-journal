<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use App\Web\Attributes\Concerns\InjectsSurfaceValue;
use App\Web\Creation\SurfaceContext;
use Attribute;
use Spatie\LaravelData\Attributes\InjectsPropertyValue;
use Spatie\LaravelData\Support\DataProperty;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class CurrentSession implements InjectsPropertyValue
{
    use InjectsSurfaceValue;

    private function read(SurfaceContext $context, DataProperty $property): string|null
    {
        return $context->session();
    }
}
