<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\Messages\RequireMessageAnswer\RequireMessageAnswerCommand;
use Illuminate\Foundation\Http\FormRequest;

final class RequireMessageAnswerRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'messageId' => ['required', 'string', 'size:26'],
        ];
    }

    public function command(): RequireMessageAnswerCommand
    {
        return new RequireMessageAnswerCommand(
            $this->string('messageId')->toString(),
        );
    }
}
