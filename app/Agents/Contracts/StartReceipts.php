<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Support\OwnerStartReceipt;
use App\Records\Support\RecordIdentity;

/**
 * The receipt of a start an owner asked for its work, read again later, such as after the owner restarts. Only the
 * actor that asked reads it.
 */
interface StartReceipts
{
    /**
     * @throws StartRecordMissing
     */
    public function receiptFor(RecordIdentity $work): OwnerStartReceipt;
}
