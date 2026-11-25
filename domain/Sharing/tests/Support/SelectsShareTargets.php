<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Support;

use App\Support\RecordIdentity;
use App\Support\ShareRecordCard;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Support\ConsumedPreview;
use Domain\Sharing\Support\ShareCandidates;
use Domain\Sharing\Support\ShareLinkedCandidate;
use Domain\Sharing\Support\ShareSelectedTarget;

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
