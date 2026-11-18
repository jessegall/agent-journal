<?php

declare(strict_types=1);

namespace App\Http\Requests\Processes;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The text of a repository declaration file, read on the agent's side and sent whole.
 */
final class ImportProposalsRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['declarations' => ['required', 'string', 'max:1000000']];
    }

    public function declarations(): string
    {
        return $this->string('declarations')->toString();
    }
}
