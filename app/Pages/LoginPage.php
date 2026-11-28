<?php

declare(strict_types=1);

namespace App\Pages;

use App\Accounts\Data\LoginInput;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The sign-in page: the form's starting values. It sits outside the app shell.
 */
#[TypeScript]
final class LoginPage extends Data
{
    /** @use \App\Web\Creation\Buildable<LoginPageFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = LoginPageFields::class;

    public const string COMPONENT = 'Login';

    public function __construct(public readonly LoginInput $input) {}

    public static function startingWith(LoginInput $input): self
    {
        return self::from(['input' => $input]);
    }
}
