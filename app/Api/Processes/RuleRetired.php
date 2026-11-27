<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The classification rule a retirement took out of use.
 */
final class RuleRetired extends Data
{
    public function __construct(
        #[MapName('rule_id')]
        public readonly string $ruleId,
        public readonly string $state,
    ) {}
}
