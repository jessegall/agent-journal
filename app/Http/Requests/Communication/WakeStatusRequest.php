<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use Illuminate\Foundation\Http\FormRequest;

final class WakeStatusRequest extends FormRequest
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

    public function messageId(): string
    {
        return $this->string('messageId')->toString();
    }
}
