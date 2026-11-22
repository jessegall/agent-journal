<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What the one next step of a refused start leads to, which the browser maps to a field or an action.
 */
enum StartRemedyType: string
{
    case ChooseModel = 'choose-model';
    case ChooseProgram = 'choose-program';
    case ChooseAccount = 'choose-account';
    case ReviewConfiguration = 'review-configuration';
    case RetryStart = 'retry-start';
    case CheckCapacity = 'check-capacity';
    case ConnectHost = 'connect-host';
    case UpdateHost = 'update-host';
    case StartNewConversation = 'start-new-conversation';
    case ChooseConversation = 'choose-conversation';
    case OperatorInstruction = 'operator-instruction';

    /**
     * The start form's field this step is taken at, which a browser's refusal is shown under; a step no field takes
     * is shown for the whole command.
     */
    public function field(): string
    {
        return match ($this) {
            self::ChooseModel => 'model',
            self::ChooseProgram => 'driver',
            self::ChooseAccount => 'accountId',
            self::ChooseConversation, self::StartNewConversation => 'conversationId',
            self::ReviewConfiguration, self::RetryStart, self::CheckCapacity, self::ConnectHost, self::UpdateHost,
            self::OperatorInstruction => 'command',
        };
    }
}
