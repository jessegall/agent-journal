<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\RecordIdentity;

/**
 * The visible source selected by the caller for their current request.
 */
interface RequestSource
{
    public function selectedSource(): RecordIdentity|null;
}
