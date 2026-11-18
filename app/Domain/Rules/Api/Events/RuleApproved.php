<?php

declare(strict_types=1);

namespace App\Domain\Rules\Api\Events;

use App\Core\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner approved a proposed rule; it holds from now on. Raised once the change has committed.
 */
final readonly class RuleApproved implements ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public int $ruleId) {}
}
