<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use Illuminate\Foundation\Http\FormRequest;

final class SendMessageRequest extends FormRequest
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
            'body' => [
                'required',
                'string',
            ],
            'targetMessageNumber' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }

    public function command(): SendMessageCommand
    {
        return new SendMessageCommand(
            $this->string('inboxId')->toString(),
            $this->string('body')->toString(),
            $this->filled('targetMessageNumber') ? $this->integer('targetMessageNumber') : null,
        );
    }
}
