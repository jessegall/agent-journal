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

    /**
     * The operations that act on the runtime itself rather than its turns; a host takes them before any other work.
     *
     * @return list<self>
     */
    public static function control(): array
    {
        return [self::Stop, self::Interrupt, self::StartRecording, self::StopRecording];
    }
}
