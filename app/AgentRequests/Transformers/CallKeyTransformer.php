<?php

declare(strict_types=1);

namespace App\AgentRequests\Transformers;

use App\AgentRequests\Support\CallKey;
use Spatie\LaravelData\Support\DataProperty;
use Spatie\LaravelData\Support\Transformation\TransformationContext;
use Spatie\LaravelData\Transformers\Transformer;

/**
 * Writes a request key as the text it travels as.
 */
final class CallKeyTransformer implements Transformer
{
    /**
     * @param  CallKey  $value
     */
    public function transform(DataProperty $property, mixed $value, TransformationContext $context): string
    {
        return $value->value;
    }
}
