<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The rule of an access policy that decided an operation, shown with every decision.
 */
enum AccessRuleType: string
{
    case ExplicitDenial = 'explicit_denial';
    case ProtectedArea = 'protected_area';
    case Unclassified = 'unclassified';
    case OperationGrant = 'operation_grant';
    case ClassGrant = 'class_grant';
    case NotGranted = 'not_granted';
}
