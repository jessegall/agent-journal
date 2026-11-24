<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Releases;

use App\Data\Images\ReleaseCompatibilityData;
use App\Support\PublishedReleases;

/**
 * Tells a relay, whatever protocol it speaks, which release this journal publishes and which protocols it speaks.
 */
final readonly class ReleaseCompatibilityController
{
    public function __invoke(PublishedReleases $releases): ReleaseCompatibilityData
    {
        return $releases->compatibility();
    }
}
