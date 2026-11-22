<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Values\MappedRefusal;
use Throwable;

/**
 * What other Core areas use of the Bus area's RefusalMapper.
 */
interface RefusalMapper
{
    /**
     * The failure as a caller is shown it; a failure nothing names is reported and shown only with its correlation id.
     */
    public function refusal(Throwable $failure, string $subject, string $correlationId): MappedRefusal;
}
