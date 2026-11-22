<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a report page's receipt part: the report number whose report-ready receipt the page marks read once
 * it is shown.
 */
#[TypeScript]
final class ReportReceiptPartData extends Data
{
    public function __construct(public readonly string $number) {}
}
