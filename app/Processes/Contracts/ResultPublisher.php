<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Exceptions\EvidenceRejected;
use App\Processes\Models\ResultReceipt;
use App\Processes\Values\VerifiedOutput;

/**
 * Publishes the one result receipt of a verified output; nothing else writes a receipt.
 */
interface ResultPublisher
{
    /**
     * @throws EvidenceRejected
     */
    public function publish(VerifiedOutput $verified): ResultReceipt;
}
