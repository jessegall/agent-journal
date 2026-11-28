<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What an agent's status lets a viewer do now, which the browser maps to its route or dialog. A message starts or
 * resumes a stopped agent, so no action does; Stop ends the session from the chat list and Interrupt stops the turn
 * from the composer.
 */
#[TypeScript]
enum StatusActionType: string
{
    case Retry = 'retry';
    case Switch = 'switch';
    case CheckStatus = 'check-status';
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
            self::Retry => 'Retry',
            self::Switch => 'Switch',
            self::CheckStatus => 'Check status',
            self::SignIn => 'Sign in',
            self::Dismiss => 'Dismiss',
            self::CancelStart => 'Cancel start',
            self::RecheckSwitch => 'Check and switch',
            self::OpenTerminal => 'Open terminal',
            self::Stop => 'End session',
            self::Interrupt => 'Interrupt',
        };
    }
}
