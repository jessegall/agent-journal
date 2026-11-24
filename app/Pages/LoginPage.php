<?php

declare(strict_types=1);

namespace App\Pages;

use App\Data\Accounts\LoginInput;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The sign-in page: the form's starting values. It sits outside the app shell.
 */
#[TypeScript]
final class LoginPage extends Data
{
    public const string COMPONENT = 'Login';

    public function __construct(public readonly LoginInput $input) {}

    public static function startingWith(LoginInput $input): self
    {
        return self::from(['input' => $input]);
    }
}
