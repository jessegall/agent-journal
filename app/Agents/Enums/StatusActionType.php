<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What an agent's status lets a viewer do now, which the browser maps to its route or dialog.
 */
#[TypeScript]
enum StatusActionType: string
{
    case Start = 'start';
    case Resume = 'resume';
    case Retry = 'retry';
    case Switch = 'switch';
    case CheckStatus = 'check-status';
    case CheckCapacity = 'check-capacity';
    case SignIn = 'sign-in';
    case Dismiss = 'dismiss';
    case CancelStart = 'cancel-start';
    case RecheckSwitch = 'recheck-switch';
    case OpenTerminal = 'open-terminal';
    case Stop = 'stop';
    case Interrupt = 'interrupt';

    /**
     * The button's words; a retry names the operation it repeats.
     */
    public function label(): string
    {
        return match ($this) {
            self::Start => 'Start session',
            self::Resume => 'Resume',
            self::Retry => 'Retry',
            self::Switch => 'Switch',
            self::CheckStatus => 'Check status',
            self::CheckCapacity => 'Check capacity',
            self::SignIn => 'Sign in',
            self::Dismiss => 'Dismiss',
            self::CancelStart => 'Cancel start',
            self::RecheckSwitch => 'Check and switch',
            self::OpenTerminal => 'Open the program',
            self::Stop => 'Stop session',
            self::Interrupt => 'Interrupt',
        };
    }
}
