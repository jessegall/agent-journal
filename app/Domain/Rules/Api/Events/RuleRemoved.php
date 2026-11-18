<?php

declare(strict_types=1);

namespace App\Domain\Rules\Api\Events;

use App\Core\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A rule stopped holding. Raised once the change has committed.
 */
final readonly class RuleRemoved implements ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public int $ruleId) {}
}
