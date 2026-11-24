<?php

declare(strict_types=1);

namespace App\Data\Processes;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of the review list's native part for module rule bundles: those waiting for activation at their exact
 * digest, each activated with its own idempotency key.
 */
#[TypeScript]
final class BundleListPartData extends Data
{
    /**
     * @param  list<BundleRowData>  $bundles
     */
    public function __construct(
        #[DataCollectionOf(BundleRowData::class)]
        public readonly array $bundles,
    ) {}
}
