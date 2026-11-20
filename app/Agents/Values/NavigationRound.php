<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\NavigationCompletion;
use App\Agents\Enums\NavigationKey;

/**
 * One round the main agent sends to a stalled runtime: the navigation request, row version and screen generation it
 * answers, and exactly one of named keys, a label to choose, the label it saw highlighted to confirm, or a proof with
 * what it completes.
 */
final readonly class NavigationRound
{
    /**
     * @param  list<NavigationKey>  $keys
     */
    private function __construct(
        public string $navigationRequestId,
        public int $rowVersion,
        public int $generation,
        public array $keys = [],
        public string|null $choose = null,
        public string|null $confirm = null,
        public string|null $proof = null,
        public NavigationCompletion|null $completes = null,
        public int|null $nextStep = null,
        public string|null $typeParameter = null,
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

    /**
     * The round as a driver request's navigation_round column keeps it.
     *
     * @param  array{request: string, row_version: int, generation: int, keys: list<string>, choose: string|null,
     *     confirm: string|null, proof: string|null, completes: string|null, next_step: int|null,
     *     type_parameter: string|null}  $stored
     */
    public static function fromStored(array $stored): self
    {
        return new self(
            $stored['request'],
            $stored['row_version'],
            $stored['generation'],
            array_map(fn (string $key) => NavigationKey::from($key), $stored['keys']),
            $stored['choose'],
            $stored['confirm'],
            $stored['proof'],
            $stored['completes'] === null ? null : NavigationCompletion::from($stored['completes']),
            $stored['next_step'],
            $stored['type_parameter'],
        );
    }

    /**
     * @return array{request: string, row_version: int, generation: int, keys: list<string>, choose: string|null,
     *     confirm: string|null, proof: string|null, completes: string|null, next_step: int|null,
     *     type_parameter: string|null}
     */
    public function toStored(): array
    {
        return [
            'request' => $this->navigationRequestId,
            'row_version' => $this->rowVersion,
            'generation' => $this->generation,
            'keys' => array_map(fn (NavigationKey $key) => $key->value, $this->keys),
            'choose' => $this->choose,
            'confirm' => $this->confirm,
            'proof' => $this->proof,
            'completes' => $this->completes?->value,
            'next_step' => $this->nextStep,
            'type_parameter' => $this->typeParameter,
        ];
    }
}
