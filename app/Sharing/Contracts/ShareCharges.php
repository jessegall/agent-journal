<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Sharing\Exceptions\ShareBudgetExceeded;

/**
 * What a share provider charges to the budget of the one preview or public read it serves: the text and metadata it
 * loads, the output it renders, and the records and links it reaches. A charge past a limit ends that preview or read.
 */
interface ShareCharges
{
    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeText(int $bytes): void;

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeMetadata(int $bytes): void;

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeRendered(int $bytes): void;

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeRecords(int $count): void;

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeLinks(int $count): void;
}
