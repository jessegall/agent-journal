<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Commands\MarkNotificationRead\MarkNotificationReadCommand;
use Illuminate\Foundation\Http\FormRequest;

final class MarkNotificationReadRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'receiptId' => ['required', 'string', 'size:26'],
        ];
    }

    public function command(): MarkNotificationReadCommand
    {
        return new MarkNotificationReadCommand($this->string('receiptId')->toString());
    }
}
