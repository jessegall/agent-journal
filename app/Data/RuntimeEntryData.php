<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One runtime on the status page: its stored status and its latest requests, newest first.
 */
#[TypeScript]
final class RuntimeEntryData extends Data
{
    /**
     * @param  list<DriverRequestStatus>  $requests
     */
    public function __construct(
        public readonly RuntimeStatus $status,
        #[DataCollectionOf(DriverRequestStatus::class)]
        public readonly array $requests,
    ) {}
}
