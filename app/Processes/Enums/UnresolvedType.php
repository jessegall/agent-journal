<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why the classifier could not place part of a command; any such fact keeps the whole command unknown.
 */
enum UnresolvedType: string
{
    case UnknownProgram = 'unknown_program';
    case UnknownOption = 'unknown_option';
    case UnknownSubcommand = 'unknown_subcommand';
    case DynamicWord = 'dynamic_word';
    case UnresolvedExecutable = 'unresolved_executable';
    case InterpretedSource = 'interpreted_source';
    case UnsupportedSyntax = 'unsupported_syntax';
    case UnknownWrapperOption = 'unknown_wrapper_option';
    case PendingReview = 'pending_review';
}
