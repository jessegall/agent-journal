<?php

declare(strict_types=1);

namespace Domain\Rules\Data;

use Domain\Rules\Api\RuleList;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which page of how many, and how many rows in all.
 *
 * @method static static from(RuleList|array<string, mixed> $payload)
 */
#[TypeScript]
final class RulePaginationData extends Data
{
    public function __construct(
        public readonly int $page,
        public readonly int $lastPage,
        public readonly int $total,
    ) {}

    public static function fromRuleList(RuleList $rulePage): self
    {
        return self::from(['page' => $rulePage->page, 'lastPage' => $rulePage->lastPage, 'total' => $rulePage->total]);
    }
}
