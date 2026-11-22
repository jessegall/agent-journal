<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The operations every driver offers (doc 40, section 51), plus a key script.
 */
#[TypeScript]
enum DriverOperation: string
{
    case Deliver = 'deliver';
    case Wake = 'wake';
    case ChangeModel = 'change_model';
    case ChangeEffort = 'change_effort';
    case Interrupt = 'interrupt';
    case Stop = 'stop';
    case KeyScript = 'key_script';
    case StartRecording = 'start_recording';
    case StopRecording = 'stop_recording';
    case Navigate = 'navigate';
    case TakeControl = 'take_control';
    case CancelTake = 'cancel_take';
    case ReleaseControl = 'release_control';
    case TerminalInput = 'terminal_input';
    case DraftChoice = 'draft_choice';
    case CheckScreen = 'check_screen';
    case OpenPrivateEntry = 'open_private_entry';
    case PrivateInput = 'private_input';
    case CancelPrivateEntry = 'cancel_private_entry';

    /**
     * The operations that act on the runtime itself rather than its turns; a host takes them before any other work.
     *
     * @return list<self>
     */
    public static function control(): array
    {
        return [
            self::Stop,
            self::Interrupt,
            self::StartRecording,
            self::StopRecording,
            ...self::terminalControl(),
        ];
    }

    /**
     * The operations a browser writer's grant sends to the host's input gate; their payload is cleared once the host
     * reports how they ended.
     *
     * @return list<self>
     */
    public static function terminalControl(): array
    {
        return [
            self::TakeControl,
            self::CancelTake,
            self::ReleaseControl,
            self::TerminalInput,
            self::DraftChoice,
            self::CheckScreen,
            self::OpenPrivateEntry,
            self::PrivateInput,
            self::CancelPrivateEntry,
        ];
    }

    public function isTerminalControl(): bool
    {
        return in_array($this, self::terminalControl(), true);
    }
}
