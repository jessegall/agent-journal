<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Rules\Api\RuleList;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which page of how many, and how many rows in all.
 *
 * @method static static from(RuleList $list)
 */
#[TypeScript]
final class PaginationData extends Data
{
    public function __construct(
        public readonly int $page,
        public readonly int $lastPage,
        public readonly int $total,
    ) {}

    public static function fromRuleList(RuleList $list): self
    {
        return new self(page: $list->page, lastPage: $list->lastPage, total: $list->total);
    }
}
