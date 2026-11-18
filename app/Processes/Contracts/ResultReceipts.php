<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Models\ResultReceipt;
use PhpOption\Option;

/**
 * The one gate every consumer reads results through (doc 21 revision 6, section 69): a current receipt of the
 * project, or none; a superseded receipt is never answered.
 */
interface ResultReceipts
{
    /**
     * @return Option<ResultReceipt>
     */
    public function find(string $receiptId): Option;

    /**
     * @return Option<ResultReceipt>
     */
    public function forPart(string $partRunId): Option;
}
