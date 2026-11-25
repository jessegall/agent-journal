<?php

declare(strict_types=1);

namespace App\Enums\Accounts;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whether a sign-in makes a new account or signs an existing one in again.
 */
#[TypeScript]
enum SignInType: string
{
    case NewAccount = 'new_account';
    case SignInAgain = 'sign_in_again';
}
