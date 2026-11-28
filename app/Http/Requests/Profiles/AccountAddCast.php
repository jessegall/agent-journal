<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

final class AccountAddCast implements Cast
{
    /**
     * @param  array<string, mixed>  $properties
     * @param  CreationContext<Data>  $context
     */
    public function cast(
        DataProperty $property,
        mixed $value,
        array $properties,
        CreationContext $context,
    ): bool {
        return in_array($value, [true, 1, '1'], true);
    }
}
