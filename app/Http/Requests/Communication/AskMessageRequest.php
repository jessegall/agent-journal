<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Communication\Commands\AskMessage;
use Illuminate\Foundation\Http\FormRequest;

final class AskMessageRequest extends FormRequest
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

    public function command(): AskMessage
    {
        return new AskMessage(
            $this->string('sourceInboxId')->toString(),
            $this->string('destinationInboxId')->toString(),
            $this->string('body')->toString(),
        );
    }
}
