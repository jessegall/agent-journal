<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Contracts\CommandLines\Condition;
use App\Exceptions\ProfileRefused;
use App\Values\DriverStart;
use Closure;

/**
 * A start a driver never runs: while its condition holds, the start is refused with its reason.
 */
final readonly class StartRefusal
{
    /**
     * @param  Condition<DriverStart>  $condition
     * @param  Closure(): ProfileRefused  $refusal
     */
    public function __construct(private Condition $condition, private Closure $refusal) {}

    /**
     * @throws ProfileRefused
     */
    public function assertAllows(DriverStart $start): void
    {
        if ($this->condition->holdsFor($start)) {
            throw ($this->refusal)();
        }
    }
}
