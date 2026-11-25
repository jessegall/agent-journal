<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Domain\Sharing\Models\ShareGatewayConfiguration;
use App\Support\RecordIdentity;

/**
 * A preview the owner confirmed and used, under its locked gateway configuration: the root, the selected targets and
 * the candidates they were found among, from which each target's source is read.
 */
final readonly class ConsumedPreview
{
    /**
     * @param  list<ShareSelectedTarget>  $selection
     */
    public function __construct(
        public ShareGatewayConfiguration $configuration,
        public RecordIdentity $root,
        public array $selection,
        public ShareCandidates $candidates,
    ) {}
}
