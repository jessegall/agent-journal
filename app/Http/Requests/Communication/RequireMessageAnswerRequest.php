<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Communication\Commands\RequireMessageAnswer;
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

    public function command(): RequireMessageAnswer
    {
        return new RequireMessageAnswer(
            $this->string('messageId')->toString(),
        );
    }
}
