<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The code the owner typed for the sign-in the route names; the sign-in's own rules check it.
 */
final class SubmitSignInCodeRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['code' => ['required', 'string', 'max:600']];
    }

    public function attemptId(): string
    {
        return (string) $this->route('attempt');
    }

    public function code(): string
    {
        return $this->string('code')->toString();
    }
}
