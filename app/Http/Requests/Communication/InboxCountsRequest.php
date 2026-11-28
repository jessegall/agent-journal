<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use Illuminate\Foundation\Http\FormRequest;

final class InboxCountsRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'inboxId' => [
                'required',
                'string',
                'size:26',
            ],
        ];
    }

    public function inboxId(): string
    {
        return $this->string('inboxId')->toString();
    }
}
