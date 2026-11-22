<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Enums\AccountCheckResult;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The host's report of an account check: the generation it was asked in and what the driver's own check said.
 */
final class AccountCheckRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'generation' => ['required', 'integer', 'min:0'],
            'result' => ['required', Rule::enum(AccountCheckResult::class)],
        ];
    }

    public function accountId(): string
    {
        return (string) $this->route('account');
    }

    public function generation(): int
    {
        return $this->integer('generation');
    }

    public function result(): AccountCheckResult
    {
        return AccountCheckResult::from($this->string('result')->toString());
    }
}
