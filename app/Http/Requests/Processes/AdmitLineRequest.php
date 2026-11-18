<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use App\Processes\Enums\ShellDialect;
use App\Processes\Values\ExecutionContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A shell line an agent asks to run directly, the folder it runs in, and the request id that makes a retry the same
 * admission.
 */
final class AdmitLineRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'line' => ['required', 'string', 'max:100000'],
            'dialect' => ['required', Rule::enum(ShellDialect::class)],
            'working_folder' => ['required', 'string', 'max:4096'],
            'request_id' => ['required', 'string', 'max:64'],
        ];
    }

    public function line(): string
    {
        return $this->string('line')->toString();
    }

    public function dialect(): ShellDialect
    {
        return ShellDialect::from($this->string('dialect')->toString());
    }

    public function context(): ExecutionContext
    {
        $folder = $this->string('working_folder')->toString();

        return new ExecutionContext($this->dialect(), $folder, $folder);
    }

    public function requestKey(): string
    {
        return $this->string('request_id')->toString();
    }
}
