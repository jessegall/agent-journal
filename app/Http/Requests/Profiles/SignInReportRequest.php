<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\SignInIdentity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The host sign-in runner's report on the attempt the route names: its safe outcome, the generation it ran in and,
 * once verified, who the driver's own proof named: display text, subject and workspace apart; once refused, the
 * provider's short reason with any key replaced. Never the driver's other output.
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
            'display' => ['nullable', 'string', 'max:200'],
            'subject' => ['nullable', 'string', 'max:200'],
            'workspace' => ['nullable', 'string', 'max:200'],
            'expires_at' => ['nullable', 'date'],
            'refusal' => ['nullable', 'string', 'max:300'],
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

    public function identity(): SignInIdentity
    {
        return new SignInIdentity(
            $this->text('display'),
            $this->text('subject'),
            $this->text('workspace'),
            $this->text('expires_at'),
        );
    }

    public function refusal(): string|null
    {
        return $this->text('refusal');
    }

    private function text(string $key): string|null
    {
        return $this->filled($key) ? $this->string($key)->toString() : null;
    }
}
