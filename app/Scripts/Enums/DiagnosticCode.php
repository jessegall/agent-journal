<?php

declare(strict_types=1);

namespace App\Scripts\Enums;

enum DiagnosticCode: string
{
    case UnknownKeyword = 'unknown_keyword';
    case InvalidForm = 'invalid_form';
    case UnknownTrigger = 'unknown_trigger';
    case UnclosedBlock = 'unclosed_block';
    case UnexpectedEnd = 'unexpected_end';
    case UnknownObject = 'unknown_object';
    case UnknownMember = 'unknown_member';
    case NonBooleanMember = 'non_boolean_member';
    case UnknownCommand = 'unknown_command';
    case UnavailableDefinition = 'unavailable_definition';
    case DuplicateHandler = 'duplicate_handler';
    case StatementLimit = 'statement_limit';
    case NestingLimit = 'nesting_limit';
    case CommandNotAllowed = 'command_not_allowed';
    case InvalidCommand = 'invalid_command';
    case ExecutionBudget = 'execution_budget';
}
