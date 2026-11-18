<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A supervisor asking, with its run's event key, whether the run's admission still holds before its next part.
 */
final class RunCurrencyRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['key' => ['required', 'string', 'size:64']];
    }

    public function eventKey(): string
    {
        return $this->string('key')->toString();
    }
}
