<?php

declare(strict_types=1);

namespace App\Processes\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The classification rule revision an approval made active.
 */
final class RuleApproved extends Data
{
    public function __construct(
        #[MapName('rule_id')]
        public string $ruleId,
        public int $revision,
        public string $digest,
    ) {}
}
