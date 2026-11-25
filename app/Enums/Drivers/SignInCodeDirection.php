<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which way the code of a driver account's sign-in travels: the provider shows it and the user pastes it back into the
 * journal, or the journal shows it and the user enters it at the provider.
 */
#[TypeScript]
enum SignInCodeDirection: string
{
    case PasteBack = 'paste-back';
    case Outgoing = 'outgoing';
}
