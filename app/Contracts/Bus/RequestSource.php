<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\RecordIdentity;

/**
 * The visible source selected by the caller for their current request.
 */
interface RequestSource
{
    /**
     * The record the running request was selected from, such as the message an agent works from; none when there is
     * none.
     */
    public function selectedSource(): RecordIdentity|null;
}
