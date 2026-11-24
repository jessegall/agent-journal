<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Values\ProtectedItem;
use App\Values\ProtectionReport;
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
        public readonly string $driver,
        public readonly string $build,
        public readonly string $platform,
        #[DataCollectionOf(ProtectedItemData::class)]
        public readonly array $items,
    ) {}

    public function report(): ProtectionReport
    {
        return new ProtectionReport(
            $this->driver,
            $this->build,
            $this->platform,
            array_map(
                fn (ProtectedItemData $item) => new ProtectedItem(
                    $item->item,
                    $item->isEnforced,
                    $item->evidence,
                    $item->reason,
                ),
                $this->items,
            ),
        );
    }
}
