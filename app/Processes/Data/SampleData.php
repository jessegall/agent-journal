<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Models\CommandRules\EvidencePermit;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One owner-approved sample of the request: the exact line and effects approved, its capture limits, and, once run,
 * the run with each part's own end and capture state. Samples are evidence only.
 */
#[TypeScript]
final class SampleData extends Data
{
    /**
     * @param  list<string>  $approvedClasses
     * @param  list<string>  $parts  each part's operation, end and capture state as one readable line
     */
    public function __construct(
        public readonly string $permitId,
        public readonly string $line,
        public readonly array $approvedClasses,
        public readonly int $byteCap,
        public readonly int $secondsCap,
        public readonly string $runId,
        public readonly array $parts,
    ) {}

    /**
     * @param  list<string>  $parts  each part's operation, end and capture state as one readable line
     */
    public static function fromPermit(EvidencePermit $permit, array $parts): self
    {
        return new self(
            $permit->id,
            $permit->source_line,
            $permit->approved_classes,
            $permit->byte_cap,
            $permit->seconds_cap,
            (string) $permit->process_run_id,
            $parts,
        );
    }
}
