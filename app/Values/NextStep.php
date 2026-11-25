<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\RequestState;

/**
 * Where a command request stands, what it still owes, and the exact next allowed command.
 */
final readonly class NextStep
{
    /**
     * @param  list<string>  $steps
     */
    public function __construct(
        public RequestState $state,
        public array $steps,
        public string $command,
    ) {}
}
