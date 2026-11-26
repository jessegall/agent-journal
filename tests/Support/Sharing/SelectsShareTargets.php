<?php

declare(strict_types=1);

namespace Tests\Support\Sharing;

use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Support\ConsumedPreview;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareSelectedTarget;
use App\Support\RecordIdentity;
use App\Support\ShareRecordCard;

/**
 * A preview consumed with one target selected, reached from the source by the target's link, for the tests that make
 * a share's members without the whole preview flow.
 */
trait SelectsShareTargets
{
    private function selected(
        ShareGatewayConfiguration $configuration,
        RecordIdentity $source,
        ShareSelectedTarget $target,
    ): ConsumedPreview {
        $candidate = new ShareLinkedCandidate(
            new ShareRecordCard($target->record, 'Target', $target->publicationVersion),
            $source,
            $target->linkId,
        );

        $root = new ShareRecordCard($source, 'Source', '1');

        return new ConsumedPreview($configuration, $source, [$target], new ShareCandidates($root, [$candidate]));
    }
}
