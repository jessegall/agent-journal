<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why a shell line was refused before anything started (doc 21 revision 6, section 10), as a stable code.
 */
enum RefusalCode: string
{
    case SyntaxInvalid = 'syntax-invalid';
    case SyntaxUnsupported = 'syntax-unsupported';
    case AnalysisLimit = 'analysis-limit';
    case CommandUnknown = 'command-unknown';
    case OptionUnknown = 'option-unknown';
    case UnresolvedExecutable = 'unresolved-executable';
    case PendingReview = 'pending-review';
    case ReaderRequired = 'reader-required';
    case ClassDenied = 'class-denied';
    case CommandDenied = 'command-denied';
    case OutputHidden = 'output-hidden';
    case PhaseTiming = 'phase-timing';
    case RuleConflict = 'rule-conflict';
    case RuleRevisionChanged = 'rule-revision-changed';
    case ClassificationUnavailable = 'classification-unavailable';
    case RunnerUnavailable = 'runner-unavailable';

    public static function ofSyntax(ParseOutcome $outcome): self
    {
        return match ($outcome) {
            ParseOutcome::LimitExceeded => self::AnalysisLimit,
            ParseOutcome::Unsupported, ParseOutcome::DynamicExpansion => self::SyntaxUnsupported,
            default => self::SyntaxInvalid,
        };
    }

    public static function ofUnresolved(UnresolvedType $type): self
    {
        return match ($type) {
            UnresolvedType::UnknownOption, UnresolvedType::UnknownWrapperOption => self::OptionUnknown,
            UnresolvedType::UnresolvedExecutable => self::UnresolvedExecutable,
            UnresolvedType::PendingReview => self::PendingReview,
            UnresolvedType::UnsupportedSyntax => self::SyntaxUnsupported,
            default => self::CommandUnknown,
        };
    }

    /**
     * Whether a refusal with this code holds the work in a command request that names what is owed.
     */
    public function shouldOpenRequest(): bool
    {
        return in_array($this, [self::CommandUnknown, self::OptionUnknown, self::ReaderRequired], true);
    }
}
