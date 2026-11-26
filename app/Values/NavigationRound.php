<?php

declare(strict_types=1);

namespace App\Values;

use App\Navigation\Enums\NavigationCompletion;
use App\Navigation\Enums\NavigationKey;
use App\Navigation\Values\NavigationAnswer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One round the main agent sends to a stalled runtime: the navigation request, row version and screen generation it
 * answers, and exactly one of named keys, a label to choose, the label it saw highlighted to confirm, or a proof with
 * what it completes.
 */
#[MapName(SnakeCaseMapper::class)]
final class NavigationRound extends Data
{
    /**
     * @param  list<NavigationKey>  $keys
     */
    public function __construct(
        public readonly string $navigationRequestId,
        public readonly int $rowVersion,
        public readonly int $generation,
        public readonly array $keys = [],
        public readonly string|null $choose = null,
        public readonly string|null $confirm = null,
        public readonly string|null $proof = null,
        public readonly NavigationCompletion|null $completes = null,
        public readonly int|null $nextStep = null,
        public readonly string|null $typeParameter = null,
    ) {}

    /**
     * The round of a main agent's answer to the request at the row version and screen generation it read.
     */
    public static function answering(
        string $requestId,
        int $rowVersion,
        int $generation,
        NavigationAnswer $answer,
    ): self {
        return new self(
            $requestId,
            $rowVersion,
            $generation,
            keys: $answer->keys,
            choose: $answer->choose,
            confirm: $answer->confirm,
            typeParameter: $answer->typeParameter,
        );
    }

    /**
     * @param  non-empty-list<NavigationKey>  $keys
     */
    public static function keys(string $requestId, int $rowVersion, int $generation, array $keys): self
    {
        return new self($requestId, $rowVersion, $generation, keys: $keys);
    }

    public static function choose(string $requestId, int $rowVersion, int $generation, string $label): self
    {
        return new self($requestId, $rowVersion, $generation, choose: $label);
    }

    public static function confirm(string $requestId, int $rowVersion, int $generation, string $label): self
    {
        return new self($requestId, $rowVersion, $generation, confirm: $label);
    }

    public static function proof(
        string $requestId,
        int $rowVersion,
        int $generation,
        string $proof,
        NavigationCompletion $completes,
        int|null $nextStep,
    ): self {
        return new self(
            $requestId,
            $rowVersion,
            $generation,
            proof: $proof,
            completes: $completes,
            nextStep: $nextStep,
        );
    }
}
