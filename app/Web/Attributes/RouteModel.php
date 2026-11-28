<?php

declare(strict_types=1);

namespace App\Web\Attributes;

use App\Web\Attributes\Concerns\InjectsSurfaceValue;
use App\Web\Creation\Exceptions\InvalidSurfaceInput;
use App\Web\Creation\SurfaceContext;
use Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Spatie\LaravelData\Attributes\InjectsPropertyValue;
use Spatie\LaravelData\Support\DataProperty;

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class RouteModel implements InjectsPropertyValue
{
    use InjectsSurfaceValue;

    public function __construct(private string $parameter) {}

    private function read(SurfaceContext $context, DataProperty $property): Model|null
    {
        $model = $property->type->findAcceptedTypeForBaseType(Model::class);

        if ($model === null) {
            throw InvalidSurfaceInput::context($property->className, $property->name);
        }

        $alias = Relation::getMorphAlias($model);

        if (! is_string($alias) || $alias === $model) {
            throw InvalidSurfaceInput::context($property->className, $property->name);
        }

        return $context->routeModel($this->parameter, $alias);
    }
}
