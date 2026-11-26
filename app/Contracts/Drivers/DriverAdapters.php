<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * The adapter that reads and answers the hook calls of each native hook protocol, by the protocol's key.
 */
interface DriverAdapters
{
    /**
     * The adapter that reads the hook protocol the family's drivers speak.
     */
    public function for(string $family): DriverAdapter;

    /**
     * Whether an adapter reads the hook protocol of the family; a family nobody registered has none.
     */
    public function supports(string $family): bool;

    /**
     * Every adapter, one for each native hook protocol the journal reads.
     *
     * @return list<DriverAdapter>
     */
    public function all(): array;
}
