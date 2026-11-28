<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use App\Web\Attributes\Concerns\InjectsSurfaceValue;
use App\Web\Creation\SurfaceContext;
use Attribute;
use Spatie\LaravelData\Attributes\InjectsPropertyValue;
use Spatie\LaravelData\Support\DataProperty;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class QueryInput implements InjectsPropertyValue
{
    use InjectsSurfaceValue;

    public function __construct(private string $key) {}

    private function read(SurfaceContext $context, DataProperty $property): mixed
    {
        return $context->queryValue($this->key);
    }
}
