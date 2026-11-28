<?php

declare(strict_types=1);

namespace App\Pages;

use App\Accounts\Data\LoginInput;
use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The sign-in page: the form's starting values. It sits outside the app shell.
 */
#[TypeScript]
final class LoginPage extends Data
{
    /** @use Buildable<LoginPageFields> */
    use Buildable;

    protected const string FIELDS = LoginPageFields::class;

    public const string COMPONENT = 'Login';

    public function __construct(public readonly LoginInput $input) {}
}
