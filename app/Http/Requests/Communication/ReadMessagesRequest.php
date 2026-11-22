<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\ReadMessages\ReadMessagesCommand;
use Illuminate\Foundation\Http\FormRequest;

final class ReadMessagesRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'inboxId' => ['required', 'string', 'size:26'],
            'messageIds' => ['required', 'array', 'min:1', 'max:100'],
            'messageIds.*' => ['required', 'string', 'size:26', 'distinct'],
        ];
    }

    public function command(): ReadMessagesCommand
    {
        return new ReadMessagesCommand(
            $this->string('inboxId')->toString(),
            $this->messageIds(),
        );
    }

    /**
     * @return list<string>
     */
    private function messageIds(): array
    {
        return array_values(array_map(strval(...), (array) $this->input('messageIds')));
    }
}
