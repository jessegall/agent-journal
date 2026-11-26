<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans\Required;

use App\Attributes\Listeners\InCommandTransaction;
use App\Attributes\Listeners\TransactionListenerConsent;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Exceptions\RaisedOutsideUnit;
use App\Exceptions\RowWriteRefused;

/**
 * A domain listener the command's transaction requires, using the seams and exceptions Core exports for it.
 */
#[InCommandTransaction]
final readonly class RequiredProgress
{
    public function __construct(private CommandFacts $lifecycle) {}

    /**
     * @return list<class-string>
     */
    public function namesItUses(): array
    {
        return [TransactionListenerConsent::class, RowWriteRefused::class, RaisedOutsideUnit::class, $this->lifecycle::class];
    }
}
