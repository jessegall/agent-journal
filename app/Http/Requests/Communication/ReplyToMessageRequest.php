<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use Illuminate\Foundation\Http\FormRequest;

final class ReplyToMessageRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'messageId' => ['required', 'string', 'size:26'],
            'expectedStateVersion' => ['required', 'integer', 'min:0'],
            'body' => ['required', 'string'],
        ];
    }

    public function command(): ReplyToMessageCommand
    {
        return new ReplyToMessageCommand(
            $this->string('messageId')->toString(),
            $this->integer('expectedStateVersion'),
            $this->string('body')->toString(),
        );
    }
}
