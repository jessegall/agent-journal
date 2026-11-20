<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Profiles\Enums\SignInMethod;
use App\Profiles\Support\SignInProtocols;
use App\Programs\Enums\HookProgram;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

/**
 * The owner starts signing in a new account of a program, which is named once it proves who it is; the request key
 * lets a repeated click rejoin the same attempt. A program the journal does not know is refused before any attempt.
 */
final class StartSignInRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum>>
     */
    public function rules(): array
    {
        return [
            'program' => ['required', 'string', Rule::enum(HookProgram::class)],
            'method' => ['required', 'string', Rule::enum(SignInMethod::class)],
            'request_key' => ['required', 'string', 'max:128'],
        ];
    }

    /**
     * A method the program does not declare on this host is refused with the request, before any attempt.
     *
     * @return list<Closure(Validator): void>
     */
    public function after(SignInProtocols $protocols): array
    {
        return [function (Validator $validator) use ($protocols): void {
            $method = SignInMethod::tryFrom((string) $this->input('method'));

            if ($method !== null && ! in_array($method, $protocols->methodsOf($this->program()), true)) {
                $validator->errors()->add('method', 'This program has no such sign-in method here.');
            }
        }];
    }

    public function program(): string
    {
        return $this->string('program')->toString();
    }

    public function signInMethod(): SignInMethod
    {
        return SignInMethod::from($this->string('method')->toString());
    }

    public function requestKey(): string
    {
        return $this->string('request_key')->toString();
    }
}
