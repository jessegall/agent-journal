<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\ShareBudgetExceeded;

/**
 * The work a share provider may still do for one preview or public read, charged as it goes: Core counts the queries
 * of work run through it, and the provider charges the bytes, records and links it loads. Any overflow refuses that
 * preview or read only.
 */
interface ShareBudget
{
    /**
     * Runs a piece of record work and charges the queries it ran.
     *
     * @template TValue
     *
     * @param  callable(): TValue  $work
     * @return TValue
     *
     * @throws ShareBudgetExceeded
     */
    public function run(callable $work): mixed;

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

    /**
     * @throws ShareBudgetExceeded
     */
    public function assertHopsWithinBudget(int $hops): void;
}
