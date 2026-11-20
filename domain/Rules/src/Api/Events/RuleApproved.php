<?php

declare(strict_types=1);

namespace Domain\Rules\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner approved a proposed rule; it holds from now on. Raised once the change has committed.
 */
final readonly class RuleApproved implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(public string $ruleId) {}
}
