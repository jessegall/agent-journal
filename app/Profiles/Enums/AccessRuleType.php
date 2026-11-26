<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * The rule of an access policy that decided an operation, shown with every decision.
 */
enum AccessRuleType: string
{
    case ExplicitDenial = 'explicit_denial';
    case ProtectedPath = 'protected_path';
    case Unclassified = 'unclassified';
    case OperationGrant = 'operation_grant';
    case ScopeGrant = 'scope_grant';
    case NotGranted = 'not_granted';
}
