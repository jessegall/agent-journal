<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Values\PresenceReport;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Present;
use Spatie\LaravelData\Data;

/**
 * A relay's presence report as journal-agent sends it (client.PresenceReport): its boot, sequence, release, protocol,
 * the combinations it can run, how setting up the folder ended and whether it takes over a live boot.
 */
final class PresenceReportData extends Data
{
    /**
     * @param  list<array<string, string>>  $combinations
     */
    public function __construct(
        #[Max(128)]
        public readonly string $bootId,
        #[Min(1)]
        public readonly int $sequence,
        #[Max(64)]
        public readonly string $release,
        public readonly int $protocol,
        #[Present]
        public readonly array $combinations,
        #[In(['succeeded', 'failed'])]
        public readonly string $provisioning,
        public readonly bool $takeover = false,
    ) {}

    public function report(): PresenceReport
    {
        return new PresenceReport(
            $this->bootId,
            $this->sequence,
            $this->release,
            $this->protocol,
            $this->provisioning === 'succeeded',
            $this->takeover,
        );
    }
}
