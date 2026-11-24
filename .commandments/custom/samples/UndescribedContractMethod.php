<?php

declare(strict_types=1);

namespace Samples\UndescribedContractMethod;

/**
 * A contract whose methods are described but one.
 */
interface Ledger
{
    /**
     * The balance the ledger holds now.
     */
    public function balance(): int;

    // @sin UndescribedContractMethodDetector
    public function entries(): array;
}

/**
 * A base whose abstract method is described and whose public one is not.
 */
abstract class Account
{
    /**
     * The owner's name, as statements show it.
     */
    abstract public function owner(): string;

    // @sin UndescribedContractMethodDetector
    public function label(): string
    {
        return $this->owner();
    }

    // @righteous UndescribedContractMethodDetector
    private function secret(): string
    {
        return 'kept';
    }
}

/**
 * A concrete class needs no description on its methods.
 */
final class Wallet
{
    // @righteous UndescribedContractMethodDetector
    public function total(): int
    {
        return 0;
    }
}
