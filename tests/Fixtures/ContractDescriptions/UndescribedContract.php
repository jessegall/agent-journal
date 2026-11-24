<?php

declare(strict_types=1);

namespace Tests\Fixtures\ContractDescriptions;

/**
 * A contract with one described method and one without a description.
 */
interface UndescribedContract
{
    /**
     * The label a reader sees for the record.
     */
    public function label(): string;

    public function count(): int;
}
