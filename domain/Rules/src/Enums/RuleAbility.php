<?php

declare(strict_types=1);

namespace Domain\Rules\Enums;

/**
 * What an actor may do with a project rule.
 */
enum RuleAbility: string
{
    case Propose = 'propose';
    case Approve = 'approve';
    case Deny = 'deny';
    case Remove = 'remove';
}
