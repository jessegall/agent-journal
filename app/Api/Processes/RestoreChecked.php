<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * How each part of a run stands after its output was restored.
 */
final class RestoreChecked extends Data
{
    /**
     * @param  list<CapturedPart>  $capture
     */
    public function __construct(
        #[DataCollectionOf(CapturedPart::class)]
        public readonly array $capture,
    ) {}
}
