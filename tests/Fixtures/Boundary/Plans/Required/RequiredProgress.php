<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans\Required;

use App\Exceptions\RaisedOutsideUnit;
use App\Exceptions\RowWriteRefused;
use App\Contracts\Bus\CommandFacts;
use App\Attributes\Listeners\InCommandTransaction;
use App\Attributes\Listeners\TransactionListenerConsent;

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
