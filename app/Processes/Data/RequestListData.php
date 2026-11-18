<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The review list of the current project: its command requests, its active and retired rules, and the module bundles
 * waiting for activation.
 */
final class RequestListData extends Data
{
    /**
     * @param  list<RequestRowData>  $requests
     * @param  list<RuleRowData>  $rules
     * @param  list<BundleRowData>  $bundles
     */
    public function __construct(
        #[DataCollectionOf(RequestRowData::class)]
        public readonly array $requests,
        #[DataCollectionOf(RuleRowData::class)]
        public readonly array $rules,
        #[DataCollectionOf(BundleRowData::class)]
        public readonly array $bundles,
    ) {}
}
