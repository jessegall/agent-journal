<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\Messages\TakeNextMessages\TakeNextMessagesCommand;
use Illuminate\Foundation\Http\FormRequest;

final class TakeNextMessagesRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'inboxId' => ['required', 'string', 'size:26'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function command(): TakeNextMessagesCommand
    {
        return new TakeNextMessagesCommand(
            $this->string('inboxId')->toString(),
            $this->integer('limit', 1),
        );
    }
}
