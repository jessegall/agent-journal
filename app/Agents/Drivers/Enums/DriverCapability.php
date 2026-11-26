<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

use App\Values\OperationSupport;

/**
 * An operation a driver reports its support for, each answered on its own for the bound host.
 */
enum DriverCapability: string
{
    case Run = 'run';
    case Watch = 'watch';
    case Type = 'type';
    case Paste = 'paste';
    case Resize = 'resize';
    case PrivateEntry = 'private-entry';
    case KeyScripts = 'key-scripts';
    case Interrupt = 'interrupt';
    case TurnModel = 'turn-model';
    case TurnEffort = 'turn-effort';
    case Attachments = 'attachments';
    case HookMethods = 'hook-methods';
    case SignIn = 'sign-in';
    case ExactResume = 'exact-resume';
    case RunContained = 'run-contained';
    case NativeBinaryInput = 'native-binary-input';
    case SharedAccount = 'shared-account';

    public const string NO_NATIVE_BINARY = 'An attachment reaches an agent as a journal reference it reads with the '
        .'attachment tool; no driver takes a file\'s bytes as native input yet.';

    /**
     * What a driver answers for this operation unless it says otherwise: allowed, but native binary input, which no
     * driver offers, so an attachment is always a journal reference.
     */
    public function defaultSupport(): OperationSupport
    {
        return match ($this) {
            self::NativeBinaryInput => OperationSupport::unsupported(self::NO_NATIVE_BINARY),
            default => OperationSupport::allowed(),
        };
    }
}
