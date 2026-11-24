<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Values\PublishedResult;
use PhpOption\Option;

/**
 * The one gate every consumer reads results through: a current receipt of the
 * project, or none; a superseded receipt is never answered.
 */
interface ResultReceipts
{
    /**
     * @return Option<PublishedResult>
     */
    public function find(string $receiptId): Option;

    /**
     * @return Option<PublishedResult>
     */
    public function forPart(string $partRunId): Option;
}
