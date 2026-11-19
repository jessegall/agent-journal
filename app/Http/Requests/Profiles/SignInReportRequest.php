<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Profiles\Enums\SignInOutcome;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The host sign-in runner's report on the attempt the route names: its safe outcome, the generation it ran in and,
 * once verified, the identity the program's own check showed. Never the program's output.
 */
final class SignInReportRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'outcome' => ['required', Rule::enum(SignInOutcome::class)],
            'generation' => ['required', 'integer', 'min:0'],
            'identity' => ['nullable', 'string', 'max:200'],
        ];
    }

    public function attemptId(): string
    {
        return (string) $this->route('attempt');
    }

    public function outcome(): SignInOutcome
    {
        return SignInOutcome::from($this->string('outcome')->toString());
    }

    public function generation(): int
    {
        return $this->integer('generation');
    }

    public function identity(): string|null
    {
        return $this->filled('identity') ? $this->string('identity')->toString() : null;
    }
}
