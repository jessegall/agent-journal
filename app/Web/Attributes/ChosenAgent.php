<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use App\Support\HomeAgent;
use App\Web\Attributes\Concerns\InjectsSurfaceValue;
use App\Web\Creation\SurfaceContext;
use Attribute;
use Spatie\LaravelData\Attributes\InjectsPropertyValue;
use Spatie\LaravelData\Support\DataProperty;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class ChosenAgent implements InjectsPropertyValue
{
    use InjectsSurfaceValue;

    public function __construct(private string $key) {}

    private function read(SurfaceContext $context, DataProperty $property): HomeAgent|null
    {
        return $context->chosenAgent($this->key);
    }
}
