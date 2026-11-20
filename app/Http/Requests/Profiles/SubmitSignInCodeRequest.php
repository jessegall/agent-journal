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
     * Room for the longest key or token a secret method takes, with the spaces a paste brings; the attempt's method
     * decides the exact limit.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['code' => ['required', 'string', 'max:4200']];
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
