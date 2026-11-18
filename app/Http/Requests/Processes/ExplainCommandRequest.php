<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Enums\ShellDialect;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * An agent's ask to explain one shell line in a dialect.
 */
final class ExplainCommandRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'line' => ['present', 'string'],
            'dialect' => ['sometimes', Rule::enum(ShellDialect::class)],
        ];
    }

    public function line(): string
    {
        return $this->string('line')->value();
    }

    public function dialect(): ShellDialect
    {
        return $this->enum('dialect', ShellDialect::class) ?? ShellDialect::Bash;
    }
}
