<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use Illuminate\Foundation\Http\FormRequest;

final class SendMessageRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'sourceInboxId' => ['required', 'string', 'size:26'],
            'destinationInboxId' => ['required', 'string', 'size:26'],
            'body' => ['required', 'string'],
        ];
    }

    public function command(): SendMessageCommand
    {
        return new SendMessageCommand(
            $this->string('sourceInboxId')->toString(),
            $this->string('destinationInboxId')->toString(),
            $this->string('body')->toString(),
        );
    }
}
