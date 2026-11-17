<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the start form posts: the filters to return to afterwards. Built from the request, so it is validated.
 */
#[TypeScript]
final class StartPlanInput extends Data
{
    public function __construct(public readonly PlanFiltersData $filters = new PlanFiltersData) {}

    /**
     * An empty search arrives as null after Laravel's empty-string conversion; it means no search words.
     *
     * @param  array<array-key, mixed>  $properties
     * @return array<array-key, mixed>
     */
    public static function prepareForPipeline(array $properties): array
    {
        if (isset($properties['filters']) && is_array($properties['filters']) && array_key_exists('q', $properties['filters']) && $properties['filters']['q'] === null) {
            $properties['filters']['q'] = '';
        }

        return $properties;
    }
}
