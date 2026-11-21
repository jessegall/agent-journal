<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Values\ProtectedItem;
use App\Agents\Values\ProtectionReport;
use App\Programs\Enums\HookProgram;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A contained host's protection report as journal-agent sends it (host.ProtectionReport).
 */
final class ProtectionReportData extends Data
{
    /**
     * @param  list<ProtectedItemData>  $items
     */
    public function __construct(
        public readonly HookProgram $program,
        public readonly string $build,
        public readonly string $platform,
        #[DataCollectionOf(ProtectedItemData::class)]
        public readonly array $items,
    ) {}

    public function report(): ProtectionReport
    {
        return new ProtectionReport(
            $this->program,
            $this->build,
            $this->platform,
            array_map(
                fn (ProtectedItemData $item) => new ProtectedItem(
                    $item->item,
                    $item->enforced,
                    $item->evidence,
                    $item->reason,
                ),
                $this->items,
            ),
        );
    }
}
