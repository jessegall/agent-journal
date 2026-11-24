<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\NavigationCompletion;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A navigation round as it is stored, the shape NavigationRound::toArray writes: the request, the row version and
 * screen generation it read, and its keys, choice, confirmation, proof, completion, next step and typed parameter.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredNavigationRound extends Data
{
    /**
     * @param  list<string>  $keys
     */
    public function __construct(
        public readonly string $request,
        public readonly int $rowVersion,
        public readonly int $generation,
        public readonly array $keys,
        public readonly string|null $choose,
        public readonly string|null $confirm,
        public readonly string|null $proof,
        public readonly NavigationCompletion|null $completes,
        public readonly int|null $nextStep,
        public readonly string|null $typeParameter,
    ) {}
}
