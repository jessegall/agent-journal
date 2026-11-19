<?php

declare(strict_types=1);

namespace App\AgentRequests\Casts;

use App\AgentRequests\Exceptions\CallKeyInvalid;
use App\AgentRequests\Support\CallKey;
use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

/**
 * Reads a request key from the text it travels as.
 */
final class CallKeyCast implements Cast
{
    /**
     * @param  array<string, mixed>  $properties
     * @param  CreationContext<Data>  $context
     *
     * @throws CallKeyInvalid
     */
    public function cast(DataProperty $property, mixed $value, array $properties, CreationContext $context): CallKey
    {
        return new CallKey((string) $value);
    }
}
