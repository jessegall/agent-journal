<?php

declare(strict_types=1);

namespace App\Http\Requests\Communication;

use App\Notifications\Commands\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use Illuminate\Foundation\Http\FormRequest;

final class MarkAllNotificationsReadRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'through' => ['required', 'integer', 'min:0'],
        ];
    }

    public function command(): MarkAllNotificationsReadCommand
    {
        return new MarkAllNotificationsReadCommand($this->integer('through'));
    }
}
