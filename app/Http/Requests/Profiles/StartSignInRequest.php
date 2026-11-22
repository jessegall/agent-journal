<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Support\SignInProtocols;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

/**
 * The owner starts signing in a new account of a driver, which is named once it proves who it is; the page's
 * Idempotency-Key header names the click, so a repeat answers the same attempt. A driver the journal does not know is
 * refused before any attempt.
 */
final class StartSignInRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum>>
     */
    public function rules(): array
    {
        return [
            'driver' => ['required', 'string', Rule::enum(HookDriver::class)],
            'method' => ['required', 'string', Rule::enum(SignInMethod::class)],
        ];
    }

    /**
     * A method the driver does not declare on this host is refused with the request, before any attempt.
     *
     * @return list<Closure(Validator): void>
     */
    public function after(SignInProtocols $protocols): array
    {
        return [function (Validator $validator) use ($protocols): void {
            $method = SignInMethod::tryFrom((string) $this->input('method'));

            if ($method !== null && ! in_array($method, $protocols->methodsOf($this->driver()), true)) {
                $validator->errors()->add('method', 'This driver has no such sign-in method here.');
            }
        }];
    }

    public function driver(): string
    {
        return $this->string('driver')->toString();
    }

    public function signInMethod(): SignInMethod
    {
        return SignInMethod::from($this->string('method')->toString());
    }
}
