<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Communication\Commands\MarkQuestionNotificationRead;
use Illuminate\Foundation\Http\FormRequest;

final class MarkQuestionNotificationReadRequest extends FormRequest
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

    public function command(): MarkQuestionNotificationRead
    {
        return new MarkQuestionNotificationRead($this->string('messageId')->toString());
    }
}
