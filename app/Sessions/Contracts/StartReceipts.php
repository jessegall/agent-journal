<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Sessions\Exceptions\SessionRequestMissing;
use App\Sessions\OwnerStartReceipt;
use App\Support\RecordIdentity;

/**
 * The receipt of a start an owner asked for its work, read again later, such as after the owner restarts. Only the
 * actor that asked reads it.
 */
interface StartReceipts
{
    /**
     * @throws SessionRequestMissing
     */
    public function receiptFor(RecordIdentity $work): OwnerStartReceipt;
}
