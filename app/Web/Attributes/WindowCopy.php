<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use App\Web\Attributes\Concerns\InjectsSurfaceValue;
use App\Web\Creation\SurfaceContext;
use App\Web\Values\WindowInstance;
use Attribute;
use Spatie\LaravelData\Attributes\InjectsPropertyValue;
use Spatie\LaravelData\Support\DataProperty;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class WindowCopy implements InjectsPropertyValue
{
    use InjectsSurfaceValue;

    private function read(SurfaceContext $context, DataProperty $property): WindowInstance|null
    {
        return $context->window;
    }
}
