<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\ChildCheckout;

/**
 * The checkout a claimed child start gets, filled in by the area that issues its claim: none for a start that runs
 * where its parent's start folder is.
 */
final class ChildCheckoutSlot
{
    /**
     * @var list<ChildCheckout>
     */
    private array $checkouts = [];

    public function fill(ChildCheckout $checkout): void
    {
        $this->checkouts = [$checkout];
    }

    /**
     * @return list<ChildCheckout>
     */
    public function checkouts(): array
    {
        return $this->checkouts;
    }
}
