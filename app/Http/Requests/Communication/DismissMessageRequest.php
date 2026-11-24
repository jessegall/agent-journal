<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\Messages\DismissMessage\DismissMessageCommand;
use Illuminate\Foundation\Http\FormRequest;

final class DismissMessageRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'messageId' => ['required', 'string', 'size:26'],
            'reason' => ['required', 'string', 'max:2000'],
        ];
    }

    public function command(): DismissMessageCommand
    {
        return new DismissMessageCommand(
            $this->string('messageId')->toString(),
            $this->string('reason')->toString(),
        );
    }
}
