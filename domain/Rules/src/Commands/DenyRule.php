<?php

declare(strict_types=1);

namespace Domain\Rules\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Rules\Policies\RulePolicy;

/**
 * The user denies a proposed rule, so it never holds.
 *
 * @extends Command<null>
 */
#[Authorize(RulePolicy::class, AccessType::Edit)]
final readonly class DenyRule extends Command
{
    public function __construct(public string $ruleId) {}
}
