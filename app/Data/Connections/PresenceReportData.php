<?php

declare(strict_types=1);

namespace App\Data\Connections;

use App\Data\Hosts\HostDescriptorData;
use App\Values\PresenceReport;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Present;
use Spatie\LaravelData\Data;

/**
 * A relay's presence report as journal-agent sends it (client.PresenceReport): its boot, sequence, release, the
 * combinations it can run, how setting up the folder ended, whether it takes over a live boot, the setup
 * generation of the folder it reports for, and whether this boot reported what became of its earlier sessions.
 */
final class PresenceReportData extends Data
{
    /**
     * @param  list<HostDescriptorData>  $descriptors
     */
    public function __construct(
        #[Max(128)]
        public readonly string $bootId,
        #[Min(1)]
        public readonly int $sequence,
        #[Max(64)]
        public readonly string $release,
        #[Present]
        #[DataCollectionOf(HostDescriptorData::class)]
        public readonly array $descriptors,
        #[In(['succeeded', 'failed'])]
        public readonly string $provisioning,
        public readonly bool $takeover = false,
        #[Min(0)]
        public readonly int $setupGeneration = 0,
        public readonly bool $reconciled = false,
    ) {}

    public function report(): PresenceReport
    {
        return new PresenceReport(
            $this->bootId,
            $this->sequence,
            $this->release,
            $this->provisioning === 'succeeded',
            $this->takeover,
            $this->setupGeneration,
            array_map(fn (HostDescriptorData $descriptor) => $descriptor->descriptor(), $this->descriptors),
            $this->reconciled,
        );
    }
}
